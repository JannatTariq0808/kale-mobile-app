import { StyleSheet, View } from 'react-native';
import { ScreenGutter } from '../layout/ScreenGutter';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { KaleWordmarkWhite } from './KaleWordmarkWhite';
import { ProfileAvatar } from './ProfileAvatar';

/** LumHeader — kale-mobile-design/screens/KaleLumenApp.jsx */
export function LumenHeader() {
  const { type } = useResponsiveLayout();

  return (
    <ScreenGutter style={styles.gutter}>
      <View style={styles.row}>
        <KaleWordmarkWhite height={type(20)} />
        <ProfileAvatar initials="AP" />
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
