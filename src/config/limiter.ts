import {RateLimiter} from 'Limiter';

export const Limiter = new RateLimiter({
    tokensPerInterval: 2 ,
    interval:'min',
    fireImmediately:true
})