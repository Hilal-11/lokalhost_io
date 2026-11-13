import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import '../widgets/lk_button.dart';

class CartItem {
  const CartItem({required this.id, required this.name, required this.variant, required this.price, required this.qty, this.imageUrl});

  final String id;
  final String name;
  final String variant;
  final double price;
  final int qty;
  final String? imageUrl;
}

class CartScreen extends StatelessWidget {
  const CartScreen({
    super.key,
    required this.items,
    required this.onQuantityChanged,
    required this.onCheckout,
    this.shipping = 0,
    this.taxRate = 0.08,
  });

  final List<CartItem> items;
  final void Function(String id, int qty) onQuantityChanged;
  final VoidCallback onCheckout;
  final double shipping;
  final double taxRate;

  static String _money(double n) => '\$${n.toStringAsFixed(2)}';

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final subtotal = items.fold<double>(0, (s, i) => s + i.price * i.qty);
    final tax = subtotal * taxRate;
    final total = subtotal + tax + shipping;

    Widget row(String label, String value, {bool strong = false}) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: TextStyle(color: strong ? c.fg : c.fgMuted, fontSize: 15, fontWeight: strong ? FontWeight.w600 : null)),
              Text(value, style: TextStyle(color: c.fg, fontSize: 15, fontWeight: strong ? FontWeight.w600 : null)),
            ],
          ),
        );

    return Scaffold(
      backgroundColor: c.bg,
      appBar: AppBar(
        backgroundColor: c.bg,
        surfaceTintColor: Colors.transparent,
        title: Text('Bag', style: TextStyle(color: c.fg, fontWeight: FontWeight.w700)),
      ),
      body: items.isEmpty
          ? Center(child: Text('Your bag is empty.', style: TextStyle(color: c.fgMuted)))
          : ListView(
              padding: const EdgeInsets.all(20),
              children: [
                for (final item in items)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(LkRadius.lg),
                          child: item.imageUrl == null
                              ? Container(width: 76, height: 76, color: c.muted)
                              : Image.network(item.imageUrl!, width: 76, height: 76, fit: BoxFit.cover),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: c.fg, fontSize: 16, fontWeight: FontWeight.w600)),
                              Text(item.variant, style: TextStyle(color: c.fgMuted, fontSize: 13.5)),
                              const SizedBox(height: 4),
                              Text(_money(item.price), style: TextStyle(color: c.fg, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ),
                        _Stepper(
                          value: item.qty,
                          label: item.name,
                          onChanged: (q) => onQuantityChanged(item.id, q < 0 ? 0 : q),
                        ),
                      ],
                    ),
                  ),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(LkRadius.lg)),
                  child: Column(
                    children: [
                      row('Subtotal', _money(subtotal)),
                      row('Shipping', shipping == 0 ? 'Free' : _money(shipping)),
                      row('Tax', _money(tax)),
                      Divider(color: c.border),
                      row('Total', _money(total), strong: true),
                    ],
                  ),
                ),
              ],
            ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
          child: LkButton(
            label: 'Checkout · ${_money(total)}',
            size: LkButtonSize.lg,
            expand: true,
            onPressed: items.isEmpty ? null : onCheckout,
          ),
        ),
      ),
    );
  }
}

class _Stepper extends StatelessWidget {
  const _Stepper({required this.value, required this.label, required this.onChanged});

  final int value;
  final String label;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    Widget btn(IconData icon, String tip, int next) => Material(
          color: c.muted,
          shape: const CircleBorder(),
          child: InkWell(
            customBorder: const CircleBorder(),
            onTap: () => onChanged(next),
            child: Tooltip(message: tip, child: SizedBox.square(dimension: 28, child: Icon(icon, size: 14, color: c.fg))),
          ),
        );

    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(border: Border.all(color: c.border), borderRadius: BorderRadius.circular(999)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          btn(value == 1 ? Icons.delete_outline : Icons.remove, value == 1 ? 'Remove $label' : 'Decrease', value - 1),
          SizedBox(width: 28, child: Text('$value', textAlign: TextAlign.center, style: TextStyle(color: c.fg, fontWeight: FontWeight.w600))),
          btn(Icons.add, 'Increase', value + 1),
        ],
      ),
    );
  }
}
