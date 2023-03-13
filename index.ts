import { init as server } from './server';
import { config } from './config';


(async () => {
    server(config)
})()
