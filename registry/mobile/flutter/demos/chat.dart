import 'package:flutter/material.dart';
import 'package:your_app/screens/chat_screen.dart';

class ChatRoute extends StatefulWidget {
  const ChatRoute({super.key});

  @override
  State<ChatRoute> createState() => _ChatRouteState();
}

class _ChatRouteState extends State<ChatRoute> {
  final _messages = <Message>[
    const Message(id: '1', text: 'Did you get a chance to look at the new onboarding?', fromMe: false, time: '9:30'),
    const Message(id: '2', text: 'Yes — the pager feels great.', fromMe: true, time: '9:31'),
  ];

  @override
  Widget build(BuildContext context) {
    // usage-start
    return ChatScreen(
      title: 'Amelia Hart',
      messages: _messages,
      onSend: (text) => setState(() {
        _messages.add(Message(id: '${DateTime.now().millisecondsSinceEpoch}', text: text, fromMe: true, time: TimeOfDay.now().format(context)));
      }),
    );
    // usage-end
  }
}
