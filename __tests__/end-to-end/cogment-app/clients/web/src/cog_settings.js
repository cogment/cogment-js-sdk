const protos = require('./data_pb');
const {applyDeltaReplace} = require('../../../../../../src');

const _client_class = {
  id: 'client',
  // config_type: null,
  action_space: protos.ClientAction,
  observation_space: protos.Observation,
  observation_delta: protos.Observation,
  observation_delta_apply_fn: applyDeltaReplace,
  // feedback_space: null,
  // message_space: null
};

const _time_class = {
  id: 'time',
  // config_type: null,
  action_space: protos.TimeAction,
  observation_space: protos.Observation,
  observation_delta: protos.Observation,
  observation_delta_apply_fn: applyDeltaReplace,
  // feedback_space: null,
  // message_space: null,
};

const settings = {
  actor_classes: {
    client: _client_class,
    time: _time_class,
  },

  trial: {
    config_type: protos.TrialConfig,
  },

  environment: {
    config_type: protos.EnvConfig,
  },

  env_class: {
    id: 'env',
    // config_type: null,
    // message_space: null,
  },
};

module.exports = settings;
