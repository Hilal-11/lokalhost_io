import 'package:flutter/material.dart';
import 'package:your_app/blocks/pricing_plans.dart';

class PaywallScreen extends StatefulWidget {
  const PaywallScreen({super.key});

  @override
  State<PaywallScreen> createState() => _PaywallScreenState();
}

class _PaywallScreenState extends State<PaywallScreen> {
  String _plan = 'year';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        // usage-start
        child: PricingPlans(
          plans: const [
            Plan(id: 'year', name: 'Yearly', price: '\$59.99', period: '\$4.99 / month', badge: 'Save 50%'),
            Plan(id: 'month', name: 'Monthly', price: '\$9.99', period: 'billed monthly'),
            Plan(id: 'life', name: 'Lifetime', price: '\$149', period: 'one-time purchase'),
          ],
          selected: _plan,
          onChanged: (id) => setState(() => _plan = id),
          features: const ['Unlimited projects', 'Cloud sync across devices', 'All 40+ templates'],
          onContinue: () => debugPrint('purchase $_plan'), // call in_app_purchase / RevenueCat here
          onRestore: () => debugPrint('restore'),
        ),
        // usage-end
      ),
    );
  }
}
