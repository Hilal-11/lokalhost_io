import 'package:flutter/material.dart';
import 'package:your_app/screens/cart_screen.dart';

class CartRoute extends StatefulWidget {
  const CartRoute({super.key});

  @override
  State<CartRoute> createState() => _CartRouteState();
}

class _CartRouteState extends State<CartRoute> {
  var _items = const [
    CartItem(id: 'tote', name: 'Everyday Tote', variant: 'Graphite · M', price: 89, qty: 1),
    CartItem(id: 'pour', name: 'Ceramic pour-over', variant: 'Sand', price: 38, qty: 2),
  ];

  @override
  Widget build(BuildContext context) {
    // usage-start
    return CartScreen(
      items: _items,
      onQuantityChanged: (id, qty) => setState(() {
        _items = [
          for (final i in _items)
            if (i.id != id) i else if (qty > 0) CartItem(id: i.id, name: i.name, variant: i.variant, price: i.price, qty: qty),
        ];
      }),
      onCheckout: () => Navigator.of(context).pushNamed('/checkout'),
    );
    // usage-end
  }
}
