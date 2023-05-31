import prettyDuration from 'pretty-ms';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Container, Progress, Row, Table, Input } from 'reactstrap';
import { connect, disconnect, readHistory, requestDevice, shutdown, setWindSpeed } from '../../actions/sensor';
import { FormattedPM25 } from './FormattedPM25';
import { History } from './History';
import locals from './index.scss';
import { MeasurementInterval } from './MeasurementInterval';

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
  const onReadHistory = () => dispatch(readHistory());
  //   const onSetWindSpeed = (speed: number) => dispatch(setWindSpeed(speed));
  return (
    <Container className={locals.container}>
      <Row>
        <ButtonGroup>
          <Button color={connected ? 'success' : 'primary'} onClick={onConnect}>
            {connected ? 'Disconnect' : 'Connect'}
          </Button>
          <Button disabled={!connected} color={connected ? 'danger' : undefined} onClick={onShutdown}>
            {shuttingdown ? 'Shutting down' : 'Shutdown'}
          </Button>
        </ButtonGroup>
      </Row>
      <Row>
        <h1>MOPS 便携式空气净化器</h1>
        <Table className={locals.table} responsive borderless>
          <thead>
            <tr>
              <th className={locals.field}>#</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>电池</td>
              <td>
                <Progress value={latest.batteryCapacity ?? 0}>
                  {latest.batteryCapacity ? `${latest.batteryCapacity}%` : 'N/A'} {latest.batteryCharging ? '(Charging)' : '(Discharge)'}
                </Progress>
              </td>
            </tr>
            <tr>
              <td>调节风量</td>
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
              <td>当前风量</td>
              <td className='text-monospace'>{latest.windSpeed ? latest.windSpeed + '%' : 'N/A'}</td>
            </tr>
            <tr>
              <td>运行时间</td>
              <td className='text-monospace'>{latest.runTime ? prettyDuration(latest.runTime * 1000) : 'N/A'}</td>
            </tr>
            <tr>
              <td>启动时间</td>
              <td className='text-monospace'>{latest.bootTime ? prettyDuration(latest.bootTime * 1000) : 'N/A'}</td>
            </tr>
            <tr>
              <td>固件版本</td>
              <td className='text-monospace'>{latest.version ?? 'N/A'}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
      <History />
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
