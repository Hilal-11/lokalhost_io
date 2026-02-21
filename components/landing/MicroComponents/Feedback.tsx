
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
  } from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import React, { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { IoMdSend } from "react-icons/io";
import { Spinner } from "@/components/ui/spinner"
import { FeedbackSchema } from "@/lib/definitions"
import { toast, Toaster } from 'sonner';

function Feedback() {
  const [feedbackTitle , setFeedbackTitle] = useState('')
  const [feedbackDiscription , setFeedbackDiscription] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors , setErrors] = useState({
      feedback_title: "",
      feedback_discription: "",
    })
  const handleFeedbackTitle = (event:any) => {
      setFeedbackTitle(event)
  }
  const handleFeedbackDiscription = (event:any) => {
      event.preventDefault()
      setFeedbackDiscription(event.target.value)
  }
  
  const handleFocus = (e:any) => {
      setErrors((prev) => ({
        ...prev,
        feedback_discription: "",
      }));
    }

    
  const feedback = {
    feedback_title: feedbackTitle,
    feedback_discription: feedbackDiscription
  }
  const handleFeedbackSubmit = async (event:any) => {
    event.preventDefault()
    setLoading(true);
    // validation of feedback data

    const validatedFields:any = FeedbackSchema.safeParse({
          feedback_title: feedback?.feedback_title,
          feedback_discription: feedback?.feedback_discription,
        });
        // If any form fields are invalid, return early
        if(!validatedFields.success) {
          setLoading(false)
          setErrors(validatedFields.error.flatten().fieldErrors)
          return;
        }
    // api call for backend to entry in databse
    try{
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      })
      if(response.ok) {
        setFeedbackTitle('')
        setFeedbackDiscription('')
        setErrors({
          feedback_title: "",
          feedback_discription: "",
        })
        toast.success('Feedback submitted successfully!');
      }
    }catch(error:any){
      toast.error("Something went wrong. Please try again.");
    }
    finally {
      setLoading(false);
    }

  }
  return (
    <Card className="w-[340px] lg:w-[320px] md:w-[320px] h-auto">
      <Toaster position='top-right'/>
      <CardHeader>
        <Field>
            <Select onValueChange={handleFeedbackTitle} value={feedbackTitle}>
            <SelectTrigger>
                <SelectValue placeholder="Select Topic"/>
            </SelectTrigger>
           <SelectContent>
            <SelectItem value="bug_report">Report a Bug</SelectItem>
            <SelectItem value="feature_request">Feature Request</SelectItem>
            <SelectItem value="improvement">Improvement Suggestion</SelectItem>
            <SelectItem value="ui_ux_feedback">UI/UX Feedback</SelectItem>
            <SelectItem value="performance_issue">Performance Issue</SelectItem>
            <SelectItem value="account_issue">Account / Login Issue</SelectItem>
            <SelectItem value="content_issue">Content / Documentation Issue</SelectItem>
            <SelectItem value="integration_problem">Integration Problem</SelectItem>
            <SelectItem value="general_feedback">General Feedback</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
            </Select>
        </Field>
      </CardHeader>
      <CardContent>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
            <Textarea
              id="feedback"
              placeholder="Your feedback helps us improve."
              className="h-28"
              value={feedbackDiscription}
              onChange={handleFeedbackDiscription}
              onFocus={handleFocus}
            />
            <p className="font-sans text-[9px] text-red-500 font-medium relative bottom-3">{errors.feedback_discription}</p>
          </Field>
        </FieldGroup>
      </FieldSet>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 w-full">
        <button onClick={handleFeedbackSubmit} type="submit" className="flex items-center justify-center gap-2 text-xs border-t-[1px] border-l-[1px] border-r-[1px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer font-sans font-medium px-4 py-[8px] rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">{loading ? <span className="text-sm"><Spinner /></span> : <span className="text-sm"><IoMdSend /></span>}Send Feedback</button>
      </CardFooter>
    </Card>
      
  )
}

export default Feedback
