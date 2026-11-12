import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_button.dart';
import 'package:your_app/widgets/lk_card.dart';

class CardsDemo extends StatelessWidget {
  const CardsDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // usage-start
        LkCard(
          variant: LkCardVariant.elevated,
          title: 'Lake Bled, Slovenia',
          subtitle: '4 nights · from \$420',
          media: Image.network(
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
            height: 160,
            fit: BoxFit.cover,
          ),
          footer: Row(
            children: [
              Expanded(child: LkButton(label: 'Book', size: LkButtonSize.sm, onPressed: () {})),
              const SizedBox(width: 8),
              LkButton(label: 'Save', size: LkButtonSize.sm, variant: LkButtonVariant.outline, onPressed: () {}),
            ],
          ),
        ),
        // usage-end
        const SizedBox(height: 16),
        LkCard(title: 'Ceramic pour-over', subtitle: 'Outline · \$38', onTap: () {}),
        const SizedBox(height: 16),
        const LkCard(variant: LkCardVariant.filled, title: '\$2,481.20', subtitle: '+12.4% this month'),
      ],
    );
  }
}
