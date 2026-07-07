import { StyleSheet, View } from 'react-native';
import { ScreenGutter } from '../layout/ScreenGutter';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useSettingsData } from '../../hooks/useSettingsData';
import { KaleWordmarkWhite } from './KaleWordmarkWhite';
import { ProfileAvatar } from './ProfileAvatar';

/** LumHeader — kale-mobile-design/screens/KaleLumenApp.jsx */
export function LumenHeader() {
  const { type } = useResponsiveLayout();
  const settings = useSettingsData();

  return (
    <ScreenGutter style={styles.gutter}>
      <View style={styles.row}>
        <KaleWordmarkWhite height={type(20)} />
        <ProfileAvatar
          name={settings.displayName}
          photoUrl={settings.photoUrl}
          size={type(36)}
        />
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
