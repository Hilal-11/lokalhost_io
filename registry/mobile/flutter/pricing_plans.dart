import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import '../widgets/lk_button.dart';

class Plan {
  const Plan({required this.id, required this.name, required this.price, required this.period, this.badge});

  final String id;
  final String name;
  final String price;
  final String period;
  final String? badge;
}

class PricingPlans extends StatelessWidget {
  const PricingPlans({
    super.key,
    required this.plans,
    required this.selected,
    required this.onChanged,
    required this.onContinue,
    this.onRestore,
    this.features = const [],
    this.loading = false,
  });

  final List<Plan> plans;
  final String selected;
  final ValueChanged<String> onChanged;
  final VoidCallback onContinue;
  final VoidCallback? onRestore;
  final List<String> features;
  final bool loading;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              Center(
                child: Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(color: const Color(0xFFF59E0B), borderRadius: BorderRadius.circular(16)),
                  child: const Icon(Icons.star, color: Colors.white, size: 26),
                ),
              ),
              const SizedBox(height: 16),
              Center(child: Text('Unlock Pro', style: TextStyle(color: c.fg, fontSize: 27, fontWeight: FontWeight.w700))),
              const SizedBox(height: 16),
              for (final f in features)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(children: [
                    Icon(Icons.check, color: c.success, size: 18),
                    const SizedBox(width: 10),
                    Text(f, style: TextStyle(color: c.fg, fontSize: 15)),
                  ]),
                ),
              const SizedBox(height: 14),
              for (final p in plans)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _PlanTile(plan: p, selected: p.id == selected, onTap: () => onChanged(p.id)),
                ),
            ],
          ),
        ),
        SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 12, 24, 12),
            child: Column(
              children: [
                LkButton(label: 'Continue', size: LkButtonSize.lg, expand: true, loading: loading, onPressed: onContinue),
                if (onRestore != null)
                  TextButton(onPressed: onRestore, child: Text('Restore purchases', style: TextStyle(color: c.fgMuted, fontSize: 13))),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _PlanTile extends StatelessWidget {
  const _PlanTile({required this.plan, required this.selected, required this.onTap});

  final Plan plan;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    return Semantics(
      inMutuallyExclusiveGroup: true,
      checked: selected,
      label: '${plan.name}, ${plan.price}, ${plan.period}',
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(LkRadius.lg),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 150),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(LkRadius.lg),
                border: Border.all(color: selected ? c.fg : c.border, width: 2),
              ),
              child: Row(
                children: [
                  Icon(selected ? Icons.radio_button_checked : Icons.radio_button_unchecked, color: selected ? c.fg : c.border),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(plan.name, style: TextStyle(color: c.fg, fontSize: 16, fontWeight: FontWeight.w600)),
                        Text(plan.period, style: TextStyle(color: c.fgMuted, fontSize: 13)),
                      ],
                    ),
                  ),
                  Text(plan.price, style: TextStyle(color: c.fg, fontSize: 17, fontWeight: FontWeight.w700)),
                ],
              ),
            ),
          ),
          if (plan.badge != null)
            Positioned(
              top: -10,
              right: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(color: c.success, borderRadius: BorderRadius.circular(999)),
                child: Text(plan.badge!, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
              ),
            ),
        ],
      ),
    );
  }
}
