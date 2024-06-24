import React, {useEffect, useState, useRef} from 'react';
import type {PropsWithChildren} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useWSContext} from '../api';
import {mergeOrders} from '../utils/mergeOrders';
import Header from './Header';
import OrderList from './OrderList';
import {OrderType} from './types';
import ListHeader from './ListHeader';
import {useTheme} from '../theme';
import {Theme} from '../theme';

function OrderBook(): React.JSX.Element {
  const [bids, setBids] = useState([[0, 0]]);
  const [asks, setAsks] = useState([[0, 0]]);

  const {centrifuge, status} = useWSContext();

  const bidsRef = useRef(new Map<number, number>());
  const asksRef = useRef(new Map<number, number>());
  const sequence = useRef(0);

  useEffect(() => {
    if (centrifuge) {
      if (status == 'connected') {
        // Allocate Subscription to a channel.
        const sub = centrifuge.newSubscription('orderbook:SOL-USD');

        sub.on('subscribed', ({data}) => {
          console.log('subscribed');

          bidsRef.current = new Map<number, number>();
          asksRef.current = new Map<number, number>();
          sequence.current = 0;

          if (data) {
            mergeOrders(bidsRef.current, data.bids);
            mergeOrders(asksRef.current, data.asks);
            sequence.current = Number(data.sequence);
            console.log('subscribe started!', sequence.current);

            setBids([...bidsRef.current.entries()]);
            setAsks([...asksRef.current.entries()]);
          }
        });

        // React on `news` channel real-time publications.
        sub.on('publication', function (ctx) {
          if (Number(ctx.data.sequence) - sequence.current > 1) {
            console.log('lost sequence');
            sub.unsubscribe();
            sub.subscribe();
          } else {
            if (ctx.data) {
              mergeOrders(bidsRef.current, ctx.data.bids);
              mergeOrders(asksRef.current, ctx.data.asks);
              sequence.current = Number(ctx.data.sequence);

              setBids([...bidsRef.current.entries()]);
              setAsks([...asksRef.current.entries()]);
            }
          }
        });

        // Trigger subscribe process.
        sub.subscribe();

        // Trigger actual connection establishement.
        // centrifuge.connect();
        console.log('websockect connected');
      }
    }
  }, [centrifuge, status]);

  const listHeaderTitles = ['PRICE', 'SIZE'];

  const {theme} = useTheme();
  const style = styles(theme);

  return (
    <SafeAreaView style={style.container} testID="orderbook">
      <Header title="Order Book" />
      <OrderList
        type={OrderType.Ask}
        list={asks}
        header={<ListHeader titles={listHeaderTitles} />}
      />
      <OrderList
        type={OrderType.Bid}
        list={bids}
        header={<ListHeader titles={listHeaderTitles} />}
      />
    </SafeAreaView>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.$background,
      flex: 1,
    },
    spreadText: {
      backgroundColor: theme.$background,
      color: theme.$ternary,
      fontSize: 15,
      fontWeight: '700',
      paddingHorizontal: 40,
      paddingVertical: 5,
      textAlign: 'center',
    },
  });

export default OrderBook;
