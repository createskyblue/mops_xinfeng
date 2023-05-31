import prettyDuration from 'pretty-ms';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Container, Progress, Row, Table, Input } from 'reactstrap';
import { connect, disconnect, readHistory, requestDevice, shutdown, setWindSpeed } from '../../actions/sensor';
import locals from './index.scss';

export const SensorConsole: React.FC = () => {
  const dispatch = useDispatch();
  const connected = useSelector((state) => state.report.connected);
  const shuttingdown = useSelector((state) => state.report.shuttingdown);
  const latest = useSelector((state) => state.report.latest);
  const onConnect = async () => {
    if (connected) {
      await dispatch(disconnect());
    } else {
      await dispatch(requestDevice());
      await dispatch(connect());
    }
  };
  const onShutdown = () => dispatch(shutdown());
  //   const onSetWindSpeed = (speed: number) => dispatch(setWindSpeed(speed));
  return (
    <Container className={locals.container}>
      <Row>
        <ButtonGroup>
          <Button color={connected ? 'success' : 'primary'} onClick={onConnect}>
            {connected ? '断开连接' : '连接设备'}
          </Button>
          <Button disabled={!connected} color={connected ? 'danger' : undefined} onClick={onShutdown}>
            {shuttingdown ? '关机中' : '关机'}
          </Button>
        </ButtonGroup>
      </Row>
      <Row>
        <h3>MOPS 忻风随身空气净化器</h3>
        <Table responsive>
          <tbody>
            <tr>
              <td>
                <strong>电池</strong>
              </td>
              <td>
                <Progress value={latest.batteryCapacity ?? 0}>
                  {latest.batteryCapacity ? `${latest.batteryCapacity}%` : 'N/A'} {latest.batteryCharging ? '(Charging)' : '(Discharge)'}
                </Progress>
              </td>
            </tr>
            <tr>
              <td>
                <strong>调节风量</strong>
              </td>
              <td>
                <Input
                  type='range'
                  min={0}
                  max={100}
                  step={1}
                  value={latest.windSpeed ?? 0}
                  id='windSpeed'
                  onChange={(event) => dispatch(setWindSpeed(parseInt(event.target.value)))}
                />
              </td>
            </tr>
            <tr>
              <td>
                <strong>当前风量</strong>
              </td>
              <td className='text-monospace'>{latest.windSpeed ? latest.windSpeed + '%' : 'N/A'}</td>
            </tr>
            <tr>
              <td>
                <strong>运行时间</strong>
              </td>
              <td className='text-monospace'>{latest.runTime ? prettyDuration(latest.runTime * 1000) : 'N/A'}</td>
            </tr>
            <tr>
              <td>
                <strong>启动时间</strong>
              </td>
              <td className='text-monospace'>{latest.bootTime ? prettyDuration(latest.bootTime * 1000) : 'N/A'}</td>
            </tr>
            <tr>
              <td>
                <strong>固件版本</strong>
              </td>
              <td className='text-monospace'>{latest.version ?? 'N/A'}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
      <Row>
        <p>在项目`MOPS·VIDA PM Watchdog`的基础上增加风量调节功能 原项目地址是 https://github.com/NiceLabs/mops-vida-pm-watchdog</p>
        <p>本项目地址是 https://github.com/createskyblue/mops_xinfeng</p>
      </Row>
    </Container>
  );
};

const RecordDate: React.FC<{ value?: Date }> = ({ value }) => {
  if (value === undefined) {
    return <span>N/A</span>;
  }
  return (
    <span>
      {value.toLocaleString()} (Delay: {prettyDuration(Date.now() - value.getTime())})
    </span>
  );
};
