import React, { PureComponent } from 'react';
import { Row, Col, Tabs } from 'antd';
import { connect } from 'dva';
import PositionsGrid from './Virtualized/PositionsGrid';
import OrdersGrid from './Virtualized/OrdersGrid';
import TicksGrid from './Virtualized/TicksGrid';

const {TabPane} = Tabs;


@connect(({order,tick,position,basicTradeForm}) => ({
  order,tick,position,basicTradeForm
}))
class Center extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
       tableHeight: ((window.innerHeight - 290) / 2>180?(window.innerHeight - 290) / 2:180) || 180
    }
  }

  onWindowResize=()=>{
    this.setState({
      tableHeight: ((window.innerHeight - 290) / 2>180?(window.innerHeight - 290) / 2:180) || 180
    })
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/fetchOrders',
      payload: {},
    });
    dispatch({
      type: 'tick/fetchTicks',
      payload: {},
    });
    dispatch({
      type: 'position/fetchPositions',
      payload: {},
    });
    dispatch({
      type: 'contract/fetchContracts',
      payload: {},
    });
    window.addEventListener('resize', this.onWindowResize)
  }

  componentWillUnmount = () =>{
      window.removeEventListener('resize', this.onWindowResize)
  }


  updateTradeForm = (payload) =>{

    const {symbol} = payload

    const {basicTradeForm,dispatch,tick} = this.props

    dispatch({
      type: 'basicTradeForm/update',
      payload: {
        fuzzySymbol:symbol,
      },
    });
    if(basicTradeForm.form!=null&&basicTradeForm.form!==undefined){
      basicTradeForm.form.setFieldsValue({
        fuzzySymbol:symbol,
      });
    }
    dispatch({
      type: 'basicTradeForm/updateTick',
      payload: tick.ticks,
    });
    
  }


  render() {
    const {
      order,tick,position,    } = this.props;
    
    const {tableHeight} = this.state

    return (
      <Row gutter={0}>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <TicksGrid updateTradeForm={this.updateTradeForm} list={tick.ticks} height={tableHeight} />
              {/* <Tabs defaultActiveKey="1">
                <TabPane tab="行情" key="1">
                  <TicksGrid updateTradeForm={this.updateTradeForm} list={tick.ticks} height={tableHeight} />
                </TabPane>
                <TabPane tab="图" key="2">
                  开发中
                </TabPane>
              </Tabs> */}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="持仓" key="1">
                  <PositionsGrid updateTradeForm={this.updateTradeForm} list={position.positions} height={tableHeight} />
                </TabPane>
                <TabPane tab="挂单" key="2">
                  <OrdersGrid updateTradeForm={this.updateTradeForm} list={order.workingOrders} height={tableHeight} />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Center;