import styles from './styles';
import React, {ReactElement} from 'react';
import {Text, View} from 'react-native';
import {OrderType} from '../types';
import {useTheme} from '../../theme';
import {numberFormat} from '../../utils/numberFormat';

type Props = {
  price: number;
  size: number;
  total: number;
  percent: number;
  index: number;
  type: OrderType;
};

const OrderItem = ({
  price,
  size,
  total,
  percent,
  index,
  type,
}: Props): ReactElement => {
  const {theme} = useTheme();
  const style = styles(theme);
  const textStyle = type === OrderType.Ask ? style.askText : style.bidText;
  const barChartStyle =
    type === OrderType.Ask ? style.asksBarChart : style.bidsBarChart;

  return (
    <>
      <View style={[barChartStyle, {width: percent}]} />
      <View key={index} style={style.content} testID="orderItem">
        <Text style={textStyle}>{numberFormat(2).format(price)}</Text>
        <Text style={style.text}>{numberFormat().format(size)}</Text>
      </View>
    </>
  );
};

export default OrderItem;
