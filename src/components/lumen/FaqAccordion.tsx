// Design: kale-mobile-design — KAFaq (screens/KaleApp.jsx)

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, sora } from '../../theme';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const { type, leading } = useResponsiveLayout();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <View style={styles.card}>
      {items.map((item, index) => {
        const open = openId === item.id;
        return (
          <View key={item.id} style={index < items.length - 1 ? styles.rowBorder : undefined}>
            <Pressable
              onPress={() => setOpenId(open ? null : item.id)}
              style={styles.questionRow}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
            >
              <Text style={[styles.question, { fontSize: type(14), lineHeight: leading(type(14)) }]}>
                {item.question}
              </Text>
              <View style={[styles.toggle, open && styles.toggleOpen]}>
                <Ionicons name={open ? 'remove' : 'add'} size={14} color={open ? lumen.bgDark : lumen.fgMuted} />
              </View>
            </Pressable>
            {open ? (
              <Text style={[styles.answer, { fontSize: type(13), lineHeight: leading(type(13)) }]}>
                {item.answer}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
    overflow: 'hidden',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    padding: 16,
  },
  question: {
    ...sora('bold'),
    color: lumen.fg,
    flex: 1,
    letterSpacing: -0.05,
  },
  toggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(234,243,228,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  toggleOpen: {
    backgroundColor: lumen.mint,
  },
  answer: {
    ...sora('regular'),
    color: lumen.fgMuted,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
});
