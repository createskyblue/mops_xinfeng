# MOPS·VIDA PM Watchdog Protocol Design

## Initial connection information (Bluetootch LE)

Device broadcast name: `测霾单品`

| Type                     | UUID                                   |
| ------------------------ | -------------------------------------- |
| Discovery Device Service | `0x7676`                               |
| Nordic UART Service      | `6E400001-B5A3-F393-E0A9-E50E24DCCA9E` |
| RX Characteristic        | `6E400002-B5A3-F393-E0A9-E50E24DCCA9E` |
| TX Characteristic        | `6E400003-B5A3-F393-E0A9-E50E24DCCA9E` |

## Packet layout

> Receive Message

|    Offset | Field        | Block size | Note                          |
| --------: | ------------ | ---------- | ----------------------------- |
|      `00` | Magic Header | 1 byte     | `AA`                          |
|      `01` | Message Type | 1 byte     | [Message Type](#message-type) |
|      `02` | Payload      |            |                               |
| Last byte | Checksum     |            | `(sum all) & 255`             |

> Send Command

|    Offset | Field        | Block size | Note                          |
| --------: | ------------ | ---------- | ----------------------------- |
|      `00` | Magic Header | 1 byte     | `AA`                          |
|      `01` | Command Type | 1 byte     | [Command Type](#command-type) |
|      `02` | Payload      |            |                               |
| Last byte | Checksum     |            | `(sum all) & 255`             |

## Message Type

| Value | Payload size | Note                                                        |
| ----- | ------------ | ----------------------------------------------------------- |
| `01`  | 0 byte       | Shutting down Packet                                        |
| `08`  | 4 byte       | [Measurement Interval Packet](#measurement-interval-packet) |
| `09`  | 4 byte       | [Set RTC Packet](#set-rtc-packet)                           |
| `0A`  | 1 byte       | [NoMoreHistory Packet](#nomorehistory-packet)               |
| `0B`  | 8 byte       | [History Packet](#history-packet)                           |
| `16`  | 1 byte       | [Measurement Enabled Packet](#measurement-enabled-packet)   |
| `50`  | -            | [Update Packet](#update-packet)                             |
| `54`  | 6 byte       | [Version Packet](#version-packet)                           |

## Command Type

| Value | Payload size | Note                                                                 |
| ----- | ------------ | -------------------------------------------------------------------- |
| `01`  | 0 byte       | Shutdown Command                                                     |
| `08`  | 4 byte       | [Measurement Interval Command](#measurement-interval-command)        |
| `09`  | 4 byte       | [Set RTC Command](#set-rtc-command)                                  |
| `0A`  | 0 byte       | Next history Command                                                 |
| `0B`  | 0 byte       | Read history Command                                                 |
| `12`  | 16 byte      | [Rename device name Command (UNTESTED)](#rename-device-name-command) |
| `16`  | 1 byte       | [Measurement Enable Command](#measurement-enable-command)            |

### Measurement Interval Packet

| Offset | Field    | Block size | Note      |
| -----: | -------- | ---------- | --------- |
|   `02` | Interval | 4 byte     | 32 bit BE |

### Set RTC Packet

| Offset | Field     | Block size | Note      |
| -----: | --------- | ---------- | --------- |
|   `02` | Timestamp | 4 byte     | 32 bit BE |

## NoMoreHistory Packet

| Offset | Field   | Block size | Note   |
| -----: | ------- | ---------- | ------ |
|   `02` | unknown | 1 byte     | `0x01` |

## History Packet

| Offset | Field             | Block size | Note      |
| -----: | ----------------- | ---------- | --------- |
|   `02` | PM <sub>2.5</sub> | 2 byte     | 16 bit BE |
|   `06` | Timestamp         | 4 byte     | 32 bit BE |

## Measurement Enabled Packet

| Offset | Field   | Block size | Note                    |
| -----: | ------- | ---------- | ----------------------- |
|   `02` | Enabled | 1 byte     | 1: Enabled, 0: Disabled |

## Update Packet

| Offset | Field    | Block size |
| -----: | -------- | ---------- |
|   `02` | Sub type | 1 byte     |

| Type        | Value | Payload Size | Note                                                  |
| ----------- | ----- | ------------ | ----------------------------------------------------- |
| Battery     | `04`  | 16 byte      | [Battery Status Packet](#battery-status-packet)       |
| Runtime     | `05`  | 14 byte      | [Hardware Runtime Packet](#hardware-runtime-packet)   |
| Sensor      | `06`  | 13 byte      | [Sensor Data Packet](#sensor-data-packet)             |
| Measurement | `07`  | 3 byte       | [Measurement Setup Packet](#measurement-setup-packet) |

### Battery Status Packet

| Offset | Field    | Block size | Note                      |
| -----: | -------- | ---------- | ------------------------- |
|   `03` | Capacity | 1 byte     | 0 - 100                   |
|   `06` | Charging | 1 byte     | 1: Charging, 0: Discharge |

### Hardware Runtime Packet

| Offset | Field     | Block size | Note            |
| -----: | --------- | ---------- | --------------- |
|   `03` | Run time  | 4 byte     | 32 bit BE (sec) |
|   `07` | Boot time | 4 byte     | 32 bit BE (sec) |

### Sensor Data Packet

| Offset | Field             | Block size | Note                  |
| -----: | ----------------- | ---------- | --------------------- |
|   `03` | PM <sub>2.5</sub> | 2 byte     | 16 bit BE             |
|   `07` | Record Date       | 4 byte     | 32 bit BE (Timestamp) |
|   `0B` | Unknown           | 1 byte     |                       |
|   `0C` | Current Date      | 4 byte     | 32 bit BE (Timestamp) |

### Measurement Setup Packet

| Offset | Field    | Block size | Note                    |
| -----: | -------- | ---------- | ----------------------- |
|   `03` | Interval | 2 byte     | 16 bit BE (minutes)     |
|   `05` | Enabled  | 1 byte     | 1: Enabled, 0: Disabled |

## Version Packet

| Offset | Field | Block size | Note      |
| -----: | ----- | ---------- | --------- |
|   `02` | Minor | 2 byte     | 16 bit BE |
|   `04` | Major | 2 byte     | 16 bit BE |

## Measurement Interval Command

| Offset | Field    | Block size | Note      |
| -----: | -------- | ---------- | --------- |
|   `02` | Type     | 1 byte     | `08`      |
|   `03` | Interval | 2 byte     | 16 bit BE |

## Set RTC Command

| Offset | Field     | Block size | Note      |
| -----: | --------- | ---------- | --------- |
|   `02` | Type      | 1 byte     | `09`      |
|   `03` | Timestamp | 4 byte     | 32 bit BE |

## Rename device name Command

| Offset | Field   | Block size | Note            |
| -----: | ------- | ---------- | --------------- |
|   `02` | Type    | 1 byte     | `12`            |
|   `03` | Unknown | 1 byte     | `01` / `00`     |
|   `04` | Name    | 14 byte    | UTF-8 encoding? |

## Measurement Enable Command

| Offset | Field   | Block size | Note                    |
| -----: | ------- | ---------- | ----------------------- |
|   `02` | Type    | 1 byte     | `16`                    |
|   `03` | Enabled | 1 byte     | 1: Enabled, 0: Disabled |
