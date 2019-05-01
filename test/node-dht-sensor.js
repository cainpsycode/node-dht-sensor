var assert = require('chai').assert;
var sensor = require('../build/Release/node_dht_sensor');

describe('Initialize', () => {
    describe('Sensor type and GPIO pin', () => {
        it('should throw error if sensor type is not supported', () => {
            assert.throws(() => { sensor.initialize(0, 0); }, TypeError, 'Specified sensor type is not supported');
        });
        it('should initialize with valid sensor type and GPIO pin', () => {
            sensor.initialize(11, 4);
        });
    });
    describe('With invalid arguments', () => {
        it('should fail when no arguments are provided', () => {
            assert.throws(sensor.initialize, TypeError, 'Wrong number of arguments');
        });
        it('should fail when sensor type is not numeric', () => {
            assert.throws(() => { sensor.initialize('11', 0); }, TypeError, 'Invalid arguments');
        })
        it('should fail when GPIO pin is not numeric', () => {
            assert.throws(() => { sensor.initialize(11, '4'); }, TypeError, 'Invalid arguments');
        })
        it('should fail when maxRetries is not numeric', () => {
            assert.throws(() => { sensor.initialize(11, 4, 'abc'); }, TypeError, 'Invalid maxRetries parameter');
        })
    });
});

describe('Set max retries', () => {
    it('should fail if an argument is not provided', () => {
        assert.throws(sensor.setMaxRetries, TypeError, 'Wrong number of arguments');
    });
    it('should set max retries', () => {
        sensor.setMaxRetries(5);
    });
});

describe('Read sensor', () => {
    describe('Synchronously', () => {
        it ('should return a readout when no parameter is provided', () => {
            sensor.initialize(11, 4);
            var readout = sensor.read();

            assert.isObject(readout);
            assert.hasAllKeys(readout, ['temperature', 'humidity', 'isValid', 'errors']);
        });
        it('should return a readout when sensor type and GPIO pin are provided', () => {
            var readout = sensor.read(11, 4);
            assert.isObject(readout);
            assert.hasAllKeys(readout, ['temperature', 'humidity', 'isValid', 'errors']);
        });
        it('should fail when invalid sensor type is specified', () => {
            assert.throws(() => { sensor.read(3, 4); }, TypeError, 'specified sensor type is invalid');
        });
    });
    describe('Asynchronously', () => {
        it('should obtain temperature and humidity', () => {
            sensor.read(11, 4, (err, temperature, humidity) => {
                assert.isNull(err);
                assert.isNumber(temperature);
                assert.isNumber(humidity);
            });
        });
        it('should fail when invalid sensor type is specified', () => {            
            sensor.read(3, 4, (err) => {
                assert.isNotNull(err);
                assert.throws(() => {
                    assert.ifError(err, 'sensor type is invalid')
                }, Error, 'sensor type is invalid');
            });
        });
    });
    describe('With invalid arguments', () => {
        it('should fail if too many arguments are provided', () => {
            assert.throws(() => { sensor.read(1,2,3,4); }, TypeError, 'invalid number of arguments');
        });
    });
});