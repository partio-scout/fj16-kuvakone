import superagent from 'superagent';
import superagentAsPromised from 'superagent-as-promised';

export const request = superagentAsPromised(superagent);
