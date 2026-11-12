import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_bottom_sheet.dart';
import 'package:your_app/widgets/lk_button.dart';
import 'package:your_app/widgets/lk_list.dart';

class BottomSheetDemo extends StatelessWidget {
  const BottomSheetDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: LkButton(
          label: 'Open sheet',
          expand: true,
          // usage-start
          onPressed: () => showLkBottomSheet(
            context: context,
            title: 'Share',
            snapSizes: const [0.42, 0.88],
            builder: (context) => LkListGroup(
              children: [
                LkListTile(title: 'Copy link', icon: Icons.link, iconColor: Colors.blue, onTap: () => Navigator.pop(context)),
                LkListTile(title: 'Add to favourites', icon: Icons.favorite, iconColor: Colors.red, onTap: () => Navigator.pop(context)),
                LkListTile(title: 'Report', destructive: true, onTap: () => Navigator.pop(context)),
              ],
            ),
          ),
          // usage-end
        ),
      ),
    );
  }
}
