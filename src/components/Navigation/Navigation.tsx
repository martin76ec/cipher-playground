import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { StrImp, BitImp } from "../../screens";

const Navigator = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'str_imp',
      title: 'String',
      focusedIcon: 'alpha-s-circle',
      unfocusedIcon: 'alpha-s-circle-outline',
    },
    {
      key: 'bit_imp',
      title: 'Bit',
      focusedIcon: 'alpha-o-circle',
      unfocusedIcon: 'alpha-o-circle-outline',
    }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    'str_imp': StrImp,
    'bit_imp': BitImp,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export { Navigator };