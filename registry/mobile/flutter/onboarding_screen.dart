import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import '../widgets/lk_button.dart';

class OnboardingSlide {
  const OnboardingSlide({required this.title, required this.body, required this.icon, required this.color});

  final String title;
  final String body;
  final IconData icon;
  final Color color;
}

const defaultSlides = [
  OnboardingSlide(title: 'Design that ships', body: 'Production-ready screens, themed in minutes.', icon: Icons.auto_awesome, color: Color(0xFF6366F1)),
  OnboardingSlide(title: 'Fast by default', body: 'Native drivers and 60fps gestures on every component.', icon: Icons.bolt, color: Color(0xFF10B981)),
  OnboardingSlide(title: 'Yours to own', body: 'Copy the source into your app. No lock-in.', icon: Icons.verified_user, color: Color(0xFFF97316)),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key, this.slides = defaultSlides, required this.onDone});

  final List<OnboardingSlide> slides;
  final VoidCallback onDone;

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pager = PageController();
  int _index = 0;

  bool get _last => _index == widget.slides.length - 1;

  @override
  void dispose() {
    _pager.dispose();
    super.dispose();
  }

  void _next() {
    if (_last) return widget.onDone();
    _pager.nextPage(duration: const Duration(milliseconds: 320), curve: Curves.easeOutCubic);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: Column(
          children: [
            SizedBox(
              height: 44,
              child: Align(
                alignment: Alignment.centerRight,
                child: _last
                    ? null
                    : TextButton(
                        onPressed: widget.onDone,
                        child: Text('Skip', style: TextStyle(color: c.fgMuted, fontSize: 16)),
                      ),
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _pager,
                itemCount: widget.slides.length,
                onPageChanged: (i) => setState(() => _index = i),
                itemBuilder: (context, i) {
                  final s = widget.slides[i];
                  return Padding(
                    padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        AspectRatio(
                          aspectRatio: 1,
                          child: Container(
                            decoration: BoxDecoration(color: s.color, borderRadius: BorderRadius.circular(32)),
                            child: Icon(s.icon, size: 72, color: Colors.white.withValues(alpha: 0.9)),
                          ),
                        ),
                        const SizedBox(height: 40),
                        Text(s.title, style: TextStyle(color: c.fg, fontSize: 30, fontWeight: FontWeight.w700, letterSpacing: -0.5)),
                        const SizedBox(height: 12),
                        Text(s.body, style: TextStyle(color: c.fgMuted, fontSize: 17, height: 1.45)),
                      ],
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
              child: Column(
                children: [
                  Semantics(
                    label: 'Step ${_index + 1} of ${widget.slides.length}',
                    child: Row(
                      children: [
                        for (var i = 0; i < widget.slides.length; i++)
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            margin: const EdgeInsets.only(right: 6),
                            width: i == _index ? 24 : 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: i == _index ? c.fg : c.border,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  LkButton(label: _last ? 'Get started' : 'Next', size: LkButtonSize.lg, expand: true, onPressed: _next),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
