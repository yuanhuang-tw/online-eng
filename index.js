const { execSync, execFile } = require('child_process');
const ping = require('ping');
const hosts = ['168.95.1.1', '8.8.8.8', '208.67.222.222', '1.1.1.1'];
let status;
let onCount = 0;
let offCount = 0;
const appName = 'PotPlayerMini64.exe';

setInterval(intervalFunc, 5000);

function intervalFunc() {
  hosts.forEach((host) => {
    ping.sys.probe(host, (isAlive) => {
      if (isAlive) {
        onCount++;
      } else {
        offCount++;
      }

      if (onCount >= hosts.length) {
        onCount = 0;
        console.log('Online...');

        if (status === 'offline') {
          status = '';
          console.log('Network back...');

          execSync(`taskkill /f /im ${appName} /t`, (err, stdout, stderr) => {
            if (err) {
              throw err;
            }

            console.log('stdout', stdout);
            console.log('stderr', stderr);
          });

          const fun = () => {
            execFile(
              `C:\\Program Files\\DAUM\\PotPlayer\\${appName}`,
              (err, data) => {
                console.log(err);
                console.log(data.toString());
              }
            );
          }

          fun();
        }
      }

      if (offCount >= hosts.length) {
        offCount = 0;
        status = 'offline';
        console.log('Offline!!');
      }
    });
  });
}