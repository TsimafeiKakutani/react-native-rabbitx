import OrderItem from '../OrderItem';
import styles from './styles';
import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {FlatList, View} from 'react-native';
import {OrderType} from '../types';

type Props = {
  type: OrderType;
  header: ReactNode;
  list?: number[][];
};

const keyExtractor = (_: unknown, index: number) => `item-${index}`;

const OrderList = ({type, header, list}: Props): ReactElement => {
  const [total, setTotal] = useState(1);
  useEffect(() => {
    var temp = 1;
    list?.forEach(item => {
      temp += item[1];
    });
    setTotal(temp);
  }, [list]);
  return (
    <View style={styles.container} testID="orderList">
      {header}
      <FlatList
        alwaysBounceHorizontal={false}
        contentInsetAdjustmentBehavior="always"
        data={list}
        inverted={type === OrderType.Bid}
        keyExtractor={keyExtractor}
        persistentScrollbar={true}
        // renderItem={renderItem}
        renderItem={({item}) => (
          <OrderItem
            index={item[0]}
            price={item[0]}
            size={item[1]}
            percent={(item[1] / total) * 360}
            total={total}
            type={type}
          />
        )}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        testID="flatList"
      />
    </View>
  );
};

export default OrderList;
