import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import '../widgets/lk_avatar.dart';

class Message {
  const Message({required this.id, required this.text, required this.fromMe, required this.time});

  final String id;
  final String text;
  final bool fromMe;
  final String time;
}

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key, required this.title, required this.messages, required this.onSend, this.status = 'Online'});

  final String title;
  final String status;

  /// Oldest first; the list renders reversed so the newest stays at the bottom.
  final List<Message> messages;
  final ValueChanged<String> onSend;

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _draft = TextEditingController();

  @override
  void dispose() {
    _draft.dispose();
    super.dispose();
  }

  void _send() {
    final text = _draft.text.trim();
    if (text.isEmpty) return;
    widget.onSend(text);
    _draft.clear();
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final reversed = widget.messages.reversed.toList();

    return Scaffold(
      backgroundColor: c.bg,
      appBar: AppBar(
        backgroundColor: c.bg,
        surfaceTintColor: Colors.transparent,
        titleSpacing: 0,
        shape: Border(bottom: BorderSide(color: c.border, width: 0.5)),
        title: Row(
          children: [
            LkAvatar(name: widget.title, size: 36, status: LkPresence.online),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.title, style: TextStyle(color: c.fg, fontSize: 16, fontWeight: FontWeight.w600)),
                Text(widget.status, style: TextStyle(color: c.success, fontSize: 12.5)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(onPressed: () {}, tooltip: 'Call', icon: const Icon(Icons.call_outlined)),
          IconButton(onPressed: () {}, tooltip: 'Video', icon: const Icon(Icons.videocam_outlined)),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              padding: const EdgeInsets.all(12),
              itemCount: reversed.length,
              itemBuilder: (context, i) {
                final m = reversed[i];
                return Align(
                  alignment: m.fromMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 3),
                    padding: const EdgeInsets.fromLTRB(14, 8, 14, 8),
                    constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.78),
                    decoration: BoxDecoration(
                      color: m.fromMe ? c.accent : c.muted,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(20),
                        topRight: const Radius.circular(20),
                        bottomLeft: Radius.circular(m.fromMe ? 20 : 6),
                        bottomRight: Radius.circular(m.fromMe ? 6 : 20),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(m.text, style: TextStyle(color: m.fromMe ? Colors.white : c.fg, fontSize: 15.5, height: 1.35)),
                        const SizedBox(height: 2),
                        Text(m.time, style: TextStyle(color: m.fromMe ? Colors.white70 : c.fgMuted, fontSize: 11)),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          SafeArea(
            top: false,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(border: Border(top: BorderSide(color: c.border, width: 0.5))),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: TextField(
                      controller: _draft,
                      minLines: 1,
                      maxLines: 5,
                      onChanged: (_) => setState(() {}),
                      style: TextStyle(color: c.fg, fontSize: 16),
                      decoration: InputDecoration(
                        hintText: 'Message',
                        hintStyle: TextStyle(color: c.fgMuted),
                        isDense: true,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide(color: c.border)),
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide(color: c.border)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    onPressed: _draft.text.trim().isEmpty ? null : _send,
                    tooltip: 'Send',
                    style: IconButton.styleFrom(backgroundColor: c.accent, foregroundColor: Colors.white),
                    icon: const Icon(Icons.arrow_upward, size: 18),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
