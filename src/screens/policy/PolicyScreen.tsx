// Design: Lumen for IP — 22 · My policy (screens/LumenIP.jsx KaleIPPolicy)

import { Ionicons } from '../../components/icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { IPGhostButton } from '../../components/ip/IPGhostButton';
import { IPKicker } from '../../components/ip/IPKicker';
import { IPPrice } from '../../components/ip/IPPrice';
import { IPRow } from '../../components/ip/IPRow';
import { ScreenScroll } from '../../components/layout/ScreenScroll';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenCard } from '../../components/lumen/LumenCard';
import { LumenHeader } from '../../components/lumen/LumenHeader';
import {
  IP_DISCLAIMER,
  IP_HOW_TO_CLAIM_URL,
  IP_INSURER_LINE,
  IP_POLICY_DOCUMENTS_URL,
} from '../../config/incomeProtection';
import { useAppNow } from '../../hooks/useAppNow';
import { useIncomeProtection } from '../../hooks/useIncomeProtection';
import type { PolicyStackParamList } from '../../navigation/PolicyStackNavigator';
import type { IncomeProtectionRecord } from '../../types/incomeProtection';
import { headlineTextStyle } from '../../theme/textMetrics';
import { lumen, sora } from '../../theme';
import {
  buildPolicyYear,
  formatDeferredDays,
  formatLongDate,
  formatPaymentDay,
  formatPounds,
  formatPoundsBare,
} from '../../utils/ipPolicy';

type Props = NativeStackScreenProps<PolicyStackParamList, 'Policy'>;

const QUARTER_GAP = 8;

/** "13 Nov · label", or just the label when there is no date yet (never "— · label"). */
function datedLabel(date: Date | null, label: string): string {
  if (!date) return label.charAt(0).toUpperCase() + label.slice(1);
  return `${formatLongDate(date).replace(/ \d{4}$/, '')} · ${label}`;
}

/** Month 1 is only "paid" once Best's payment webhook has confirmed it. */
function month1Value(record: IncomeProtectionRecord, amount: number): string {
  if (record.paymentConfirmed === true) return `${formatPounds(amount)} paid`;
  if (record.paymentConfirmed === false) return `${formatPounds(amount)} payment failed`;
  return `${formatPounds(amount)} awaiting payment`;
}

function priceHistoryRows(record: IncomeProtectionRecord) {
  if (record.priceHistory.length > 0) {
    return record.priceHistory.map((entry) => ({
      key: `${entry.label}-${entry.appliesFrom?.getTime() ?? 0}`,
      label: datedLabel(entry.appliesFrom, entry.label),
      value: entry.paid ? `${formatPounds(entry.amount)} paid` : formatPounds(entry.amount),
      highlight: !entry.paid,
    }));
  }

  if (record.month1Premium == null) return [];
  const source = record.route === 'cardio' ? 'connected tracker' : 'quick estimate';
  return [
    {
      key: 'month1',
      label: datedLabel(record.coverStart, `month 1 price, ${source}`),
      value: month1Value(record, record.month1Premium),
      highlight: record.paymentConfirmed !== true,
    },
  ];
}

export function PolicyScreen({ navigation }: Props) {
  const { record, loading } = useIncomeProtection();
  const now = useAppNow(true);

  const quarters = useMemo(
    () => buildPolicyYear(now, record?.currentPremium ?? null),
    [now, record?.currentPremium],
  );
  const history = useMemo(() => (record ? priceHistoryRows(record) : []), [record]);

  const openUrl = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <LumenHeader />
        <ScreenScroll contentContainerStyle={styles.scrollContent}>
          <IPKicker>My policy</IPKicker>
          <Text style={[headlineTextStyle(30, lumen.fg), styles.title]}>Income Protection</Text>

          {loading && !record ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator color={lumen.mint} />
            </View>
          ) : null}

          {!loading && !record ? (
            <LumenCard style={styles.block}>
              <Text style={styles.emptyTitle}>No Income Protection policy on this account</Text>
              <Text style={styles.emptyBody}>
                If you bought cover on kale.insure, sign in with the email you used there.
              </Text>
            </LumenCard>
          ) : null}

          {record ? (
            <>
              <Text style={styles.payoutLabel}>Monthly payout</Text>
              <IPPrice value={formatPoundsBare(record.coverAmount)} size={60} unit={null} />

              <LumenCard padding={0} style={styles.block}>
                <View style={styles.rowsInner}>
                  <IPRow
                    label="Wait before payments start"
                    value={formatDeferredDays(record.deferredDays)}
                  />
                  <IPRow label="Cover started" value={formatLongDate(record.coverStart)} />
                  <IPRow label="Policy number" value={record.policyNumber ?? 'Pending from Best'} />
                  <IPRow label="Payment day" value={formatPaymentDay(record.paymentDay)} />
                  <IPRow label="Insurer" value={IP_INSURER_LINE} last />
                </View>
              </LumenCard>

              <IPKicker color={lumen.fgMuted} dot={false} style={styles.sectionKicker}>
                Your next 12 months
              </IPKicker>
              <Text style={styles.sectionSub}>Each assessment sets your next three payments.</Text>
              <View style={styles.quarterGrid}>
                {quarters.map((quarter, index) => {
                  const next = quarter.state === 'next';
                  // Before their first assessment, the first price came from the quote.
                  const label =
                    index === 0 && record.priceHistory.length === 0
                      ? 'Your starting price'
                      : `${quarter.window} assessment`;
                  return (
                    <View
                      key={quarter.window}
                      style={[styles.quarterCard, next && styles.quarterCardNext]}
                    >
                      <Text style={[styles.quarterLabel, next && styles.quarterLabelNext]}>
                        {label}
                      </Text>
                      <Text style={styles.quarterMonths}>{quarter.months}</Text>
                      {quarter.state === 'set' && quarter.price != null ? (
                        <Text style={styles.quarterPrice}>{formatPounds(quarter.price)}</Text>
                      ) : null}
                      {next ? <Text style={[styles.quarterPrice, styles.quarterPriceNext]}>Next</Text> : null}
                    </View>
                  );
                })}
              </View>

              {history.length > 0 ? (
                <>
                  <IPKicker color={lumen.fgMuted} dot={false} style={styles.sectionKicker}>
                    Price history and payments
                  </IPKicker>
                  <View style={styles.historyRows}>
                    {history.map((row, index) => (
                      <IPRow
                        key={row.key}
                        label={row.label}
                        value={row.value}
                        valueColor={row.highlight ? lumen.lime : undefined}
                        last={index === history.length - 1}
                      />
                    ))}
                  </View>
                </>
              ) : null}

              <View style={styles.actions}>
                <LumenButton onPress={() => navigation.navigate('Claim')}>Make or update a claim</LumenButton>
                <IPGhostButton onPress={() => navigation.navigate('Pause')}>Request a pause</IPGhostButton>
              </View>

              <View style={styles.links}>
                <Pressable onPress={() => openUrl(IP_POLICY_DOCUMENTS_URL)} accessibilityRole="link" hitSlop={6}>
                  <Text style={styles.link}>Policy documents</Text>
                </Pressable>
                <Pressable onPress={() => openUrl(IP_HOW_TO_CLAIM_URL)} accessibilityRole="link" hitSlop={6}>
                  <Text style={styles.link}>How to claim</Text>
                </Pressable>
              </View>

              <Text style={styles.disclaimer}>{IP_DISCLAIMER}</Text>
            </>
          ) : null}

          <Pressable
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsRow}
            accessibilityRole="button"
            accessibilityLabel="Account and settings"
          >
            <Text style={styles.settingsLabel}>Account &amp; settings</Text>
            <Ionicons name="chevron-forward" size={14} color={lumen.fgMuted} />
          </Pressable>
        </ScreenScroll>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    width: '100%',
  },
  content: {
    flex: 1,
    zIndex: 2,
    width: '100%',
  },
  scrollContent: {
    paddingTop: 16,
  },
  title: {
    letterSpacing: -1,
    marginTop: 12,
  },
  loaderWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    ...sora('bold'),
    fontSize: 16,
    lineHeight: 22,
    color: lumen.fg,
  },
  emptyBody: {
    ...sora('semibold'),
    fontSize: 13.5,
    lineHeight: 20,
    color: lumen.fgMuted,
    marginTop: 6,
  },
  payoutLabel: {
    ...sora('bold'),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.54,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginTop: 18,
    marginBottom: 8,
  },
  block: {
    marginTop: 18,
  },
  rowsInner: {
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  sectionKicker: {
    marginTop: 26,
    marginBottom: 10,
  },
  sectionSub: {
    ...sora('semibold'),
    fontSize: 13,
    lineHeight: 19,
    color: lumen.fgMuted,
    marginBottom: 12,
  },
  quarterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: QUARTER_GAP,
  },
  quarterCard: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 0,
    padding: 14,
    borderRadius: 15,
    backgroundColor: 'rgba(234,243,228,0.055)',
    borderWidth: 1,
    borderColor: lumen.hairline,
  },
  quarterCardNext: {
    backgroundColor: 'rgba(204,250,125,0.10)',
    borderColor: 'rgba(204,250,125,0.4)',
  },
  quarterLabel: {
    ...sora('bold'),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  quarterLabelNext: {
    color: lumen.lime,
  },
  quarterMonths: {
    ...sora('bold'),
    fontSize: 14,
    lineHeight: 19,
    color: lumen.fg,
    marginTop: 6,
  },
  quarterPrice: {
    ...sora('semibold'),
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.4,
    color: lumen.fg,
    marginTop: 6,
    fontVariant: ['tabular-nums'],
  },
  quarterPriceNext: {
    color: lumen.lime,
  },
  historyRows: {
    marginTop: -4,
  },
  actions: {
    marginTop: 24,
    gap: 10,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginTop: 14,
  },
  link: {
    ...sora('semibold'),
    fontSize: 13.5,
    lineHeight: 18,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
    padding: 4,
  },
  disclaimer: {
    ...sora('regular'),
    fontSize: 11.5,
    lineHeight: 17,
    color: lumen.fgMuted,
    textAlign: 'center',
    marginTop: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
  },
  settingsLabel: {
    ...sora('semibold'),
    fontSize: 14,
    lineHeight: 19,
    color: lumen.fg,
  },
});
