import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import '../widgets/lk_button.dart';

class Product {
  const Product({
    required this.name,
    required this.price,
    required this.rating,
    required this.reviews,
    required this.images,
    required this.colors,
    required this.sizes,
    required this.description,
  });

  final String name;
  final double price;
  final double rating;
  final int reviews;
  final List<String> images;
  final List<(String, Color)> colors;
  final List<String> sizes;
  final String description;
}

class ProductScreen extends StatefulWidget {
  const ProductScreen({super.key, required this.product, required this.onAddToCart});

  final Product product;
  final void Function(String color, String size) onAddToCart;

  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen> {
  int _image = 0;
  int _color = 0;
  late String _size = widget.product.sizes.length > 1 ? widget.product.sizes[1] : widget.product.sizes.first;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final p = widget.product;
    final top = MediaQuery.paddingOf(context).top;

    return Scaffold(
      backgroundColor: c.bg,
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          SizedBox(
            height: 400,
            child: Stack(
              children: [
                PageView.builder(
                  itemCount: p.images.length,
                  onPageChanged: (i) => setState(() => _image = i),
                  itemBuilder: (_, i) => Image.network(p.images[i], fit: BoxFit.cover),
                ),
                Positioned(
                  top: top + 4,
                  left: 16,
                  right: 16,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _RoundButton(icon: Icons.arrow_back, label: 'Back', onTap: () => Navigator.maybePop(context)),
                      _RoundButton(icon: Icons.favorite_border, label: 'Save', onTap: () {}),
                    ],
                  ),
                ),
                Positioned(
                  bottom: 16,
                  left: 0,
                  right: 0,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      for (var i = 0; i < p.images.length; i++)
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          margin: const EdgeInsets.symmetric(horizontal: 3),
                          width: i == _image ? 20 : 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: i == _image ? 1 : 0.5),
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(child: Text(p.name, style: TextStyle(color: c.fg, fontSize: 24, fontWeight: FontWeight.w700))),
                    Text('\$${p.price.toStringAsFixed(0)}', style: TextStyle(color: c.fg, fontSize: 22, fontWeight: FontWeight.w700)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(children: [
                  const Icon(Icons.star, size: 16, color: Color(0xFFF59E0B)),
                  const SizedBox(width: 4),
                  Text('${p.rating} · ${p.reviews} reviews', style: TextStyle(color: c.fgMuted)),
                ]),
                const SizedBox(height: 20),
                Text('Color · ${p.colors[_color].$1}', style: TextStyle(color: c.fg, fontWeight: FontWeight.w500)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    for (var i = 0; i < p.colors.length; i++)
                      Semantics(
                        label: p.colors[i].$1,
                        selected: i == _color,
                        button: true,
                        child: GestureDetector(
                          onTap: () => setState(() => _color = i),
                          child: Container(
                            margin: const EdgeInsets.only(right: 10),
                            padding: const EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: i == _color ? c.fg : Colors.transparent, width: 2),
                            ),
                            child: CircleAvatar(radius: 16, backgroundColor: p.colors[i].$2),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 20),
                Text('Size', style: TextStyle(color: c.fg, fontWeight: FontWeight.w500)),
                const SizedBox(height: 8),
                SegmentedButton<String>(
                  showSelectedIcon: false,
                  segments: [for (final s in p.sizes) ButtonSegment(value: s, label: Text(s))],
                  selected: {_size},
                  onSelectionChanged: (v) => setState(() => _size = v.first),
                ),
                const SizedBox(height: 20),
                Text(p.description, style: TextStyle(color: c.fgMuted, fontSize: 15, height: 1.45)),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Container(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
          decoration: BoxDecoration(color: c.bg, border: Border(top: BorderSide(color: c.border, width: 0.5))),
          child: LkButton(
            label: 'Add to bag',
            icon: Icons.shopping_bag_outlined,
            size: LkButtonSize.lg,
            expand: true,
            onPressed: () => widget.onAddToCart(p.colors[_color].$1, _size),
          ),
        ),
      ),
    );
  }
}

class _RoundButton extends StatelessWidget {
  const _RoundButton({required this.icon, required this.label, required this.onTap});

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.black.withValues(alpha: 0.35),
      shape: const CircleBorder(),
      child: IconButton(onPressed: onTap, tooltip: label, icon: Icon(icon, color: Colors.white, size: 20)),
    );
  }
}
