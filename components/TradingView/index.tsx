import * as React from 'react'
import {
  widget,
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
} from '../charting_library' // Make sure to follow step 1 of the README
// import { useMarket } from '../../utils/markets';
import { BONFIDA_DATA_FEED } from '../../utils/bonfidaConnector'

// This is a basic example of how to create a TV widget
// You can add more feature such as storing charts in localStorage

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol']
  interval: ChartingLibraryWidgetOptions['interval']
  datafeedUrl: string
  libraryPath: ChartingLibraryWidgetOptions['library_path']
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
  clientId: ChartingLibraryWidgetOptions['client_id']
  userId: ChartingLibraryWidgetOptions['user_id']
  fullscreen: ChartingLibraryWidgetOptions['fullscreen']
  autosize: ChartingLibraryWidgetOptions['autosize']
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides']
  containerId: ChartingLibraryWidgetOptions['container_id']
  theme: string
}

// export interface ChartContainerState {}

const TVChartContainer = () => {
  // @ts-ignore
  const defaultProps: ChartContainerProps = {
    symbol: 'BTC/USDT',
    interval: '60' as ResolutionString,
    theme: 'Dark',
    containerId: 'tv_chart_container',
    datafeedUrl: BONFIDA_DATA_FEED,
    libraryPath: '/charting_library/',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {
      'volume.volume.color.0': '#E54033',
      'volume.volume.color.1': '#AFD803',
    },
  }

  const tvWidgetRef = React.useRef<IChartingLibraryWidget | null>(null)
  // TODO: fetch market from store and wire up to chart
  // const { market, marketName } = useMarket()

  const parsedMarketName = 'BTC/USDT'
  // switch (marketName) {
  //   case 'BTC/WUSDT':
  //     parsedMarketName = 'BTC/USDT'
  //     break
  //   case 'ETH/WUSDT':
  //     parsedMarketName = 'ETH/USDT'
  //     break
  //   default:
  //     parsedMarketName = marketName
  // }

  React.useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: parsedMarketName,
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        defaultProps.datafeedUrl
      ),
      interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
      container_id: defaultProps.containerId as ChartingLibraryWidgetOptions['container_id'],
      library_path: defaultProps.libraryPath as string,
      locale: 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'timeframes_toolbar',
        'volume_force_overlay',
        'left_toolbar',
        'show_logo_on_all_charts',
        'caption_buttons_text_if_possible',
        'header_settings',
        'header_chart_type',
        'header_compare',
        'compare_symbol',
        'header_screenshot',
        'header_widget_dom_node',
        'header_saveload',
        'header_undo_redo',
        'header_interval_dialog_button',
        'show_interval_dialog_on_key_press',
        'header_symbol_search',
        'header_resolutions',
        'header_widget',
      ],
      enabled_features: ['study_templates'],
      load_last_chart: true,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      theme: 'Dark',
      overrides: {
        'paneProperties.background': '#141026',
        'mainSeriesProperties.candleStyle.upColor': '#AFD803',
        'mainSeriesProperties.candleStyle.downColor': '#E54033',
        'mainSeriesProperties.candleStyle.drawWick': true,
        'mainSeriesProperties.candleStyle.drawBorder': true,
        'mainSeriesProperties.candleStyle.borderColor': '#AFD803',
        'mainSeriesProperties.candleStyle.borderUpColor': '#AFD803',
        'mainSeriesProperties.candleStyle.borderDownColor': '#E54033',
        'mainSeriesProperties.candleStyle.wickUpColor': '#AFD803',
        'mainSeriesProperties.candleStyle.wickDownColor': '#E54033',
      },
    }

    const tvWidget = new widget(widgetOptions)
    tvWidgetRef.current = tvWidget

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton()
        button.setAttribute('title', 'Click to show a notification popup')
        button.classList.add('apply-common-tooltip')
        button.addEventListener('click', () =>
          tvWidget.showNoticeDialog({
            title: 'Notification',
            body: 'TradingView Charting Library API works correctly',
            callback: () => {
              // console.log('It works!!');
            },
          })
        )
        button.innerHTML = 'Check API'
      })
    })
    //eslint-disable-next-line
  }, [])

  // TODO: add market back to dep array
  // }, [market])

  return <div id={defaultProps.containerId} className="tradingview-chart" />
}

export default TVChartContainer
