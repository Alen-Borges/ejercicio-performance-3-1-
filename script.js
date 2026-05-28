import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import exec from 'k6/execution';

const csvData = new SharedArray('users', function () {
  const fileContent = open('./usuarios.csv');
  const parsed = papaparse.parse(fileContent, { header: true }).data;
  return parsed.filter(row => row.user && row.passwd);
});

export const options = {
  scenarios: {
    login_load_test: {
      executor: 'constant-arrival-rate',
      rate: 20,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 10,
      maxVUs: 50,
    },
  },

  thresholds: {
    http_req_failed: ['rate < 0.03'],
    http_req_duration: ['max < 1500', 'p(95) < 1500'],
  },
};

export default function () {
  const userIndex = exec.scenario.iterationInTest % csvData.length;
  const user = csvData[userIndex];

  const url = 'https://fakestoreapi.com/auth/login';
  
  const payload = JSON.stringify({
    username: user.user.trim(),
    password: user.passwd.trim(),
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'Código de respuesta es 200': (r) => r.status === 200,
    'Código de respuesta es 201': (r) => r.status === 201,
    'La respuesta contiene un token JWT': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body && typeof body.token === 'string';
      } catch (e) {
        return false;
      }
    },
  });
}
