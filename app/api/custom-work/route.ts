import { NextRequest, NextResponse } from 'next/server';
import { validateCustomWorkData } from '@/lib/definitions';
import CustomWork from '@/lib/models/custom-work';
import dbConnect from "@/lib/dbConnect";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate input
    const result = validateCustomWorkData.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    // Use validated data from here on
    const validatedData = result.data;

    // Check for duplicate submission in last 24 hours
    const existingRequest = await CustomWork.findOne({
      email: validatedData.email,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'You already submitted a request recently. Please wait 24 hours before submitting again.'
        },
        { status: 429 }
      );
    }

    // Create new custom work request with validated data
    const customWork = await CustomWork.create(validatedData);

    // TODO: Send email notifications
    // await sendEmailNotification(customWork);
    // await sendConfirmationEmail(validatedData.email, validatedData.name);

    return NextResponse.json(
      {
        success: true,
        message: 'Your request has been submitted successfully! We will contact you within 24-48 hours.',
        data: {
          id: customWork._id,
          name: customWork.name,
          email: customWork.email,
          company: customWork.company,
          phone: customWork.phone,
          message: customWork.message,
          serviceType: customWork.serviceType,
          timeline: customWork.timeline
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creating custom work:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET - Get all custom work requests (Admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    // }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Filter by service type
    if (searchParams.get('serviceType')) {
      filter.serviceType = searchParams.get('serviceType');
    }

    // Filter by timeline
    if (searchParams.get('timeline')) {
      filter.timeline = searchParams.get('timeline');
    }

    // Search by name, email, or company
    if (searchParams.get('search')) {
      const searchTerm = searchParams.get('search');
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { company: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const [customWorks, total] = await Promise.all([
      CustomWork.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CustomWork.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      data: customWorks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error: any) {
    console.error('Error fetching custom works:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching requests.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}