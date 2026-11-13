import 'package:flutter/material.dart';
import 'package:your_app/screens/product_screen.dart';

const tote = Product(
  name: 'Everyday Tote',
  price: 89,
  rating: 4.8,
  reviews: 1204,
  images: [
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900',
  ],
  colors: [('Graphite', Color(0xFF3F3F46)), ('Sand', Color(0xFFD6C7A8)), ('Sage', Color(0xFF8FA98A))],
  sizes: ['S', 'M', 'L', 'XL'],
  description: 'Water-resistant canvas, a padded laptop sleeve and a magnetic closure.',
);

class ProductRoute extends StatelessWidget {
  const ProductRoute({super.key});

  @override
  Widget build(BuildContext context) {
    // usage-start
    return ProductScreen(
      product: tote,
      onAddToCart: (color, size) {
        debugPrint('add ${tote.name} $color $size');
        Navigator.of(context).pushNamed('/cart');
      },
    );
    // usage-end
  }
}
