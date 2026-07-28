import { StyleSheet, View } from 'react-native';
import { ScreenGutter } from '../layout/ScreenGutter';
import { NotificationBellButton } from '../notifications/NotificationBellButton';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { KaleWordmarkWhite } from './KaleWordmarkWhite';

/** LumHeader — kale-mobile-design/screens/KaleLumenApp.jsx */
export function LumenHeader() {
  const { type } = useResponsiveLayout();

  return (
    <ScreenGutter style={styles.gutter}>
      <View style={styles.row}>
        <KaleWordmarkWhite height={type(20)} />
        <NotificationBellButton size={type(36)} />
      </View>
    </ScreenGutter>
  );
}

const styles = StyleSheet.create({
  gutter: {
    paddingBottom: 4,
  },
  row: {
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});
