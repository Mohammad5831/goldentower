import Dexie from 'dexie';
import axios from 'axios';

const db = new Dexie('ReactAppCache');
db.version(1).stores({
    cache: '&key, data, timestamp'
});

function makeCacheKey (baseKey, params = {}) {
    const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}:${params[k]}`)
    .join('|');
    return `${baseKey}?${sorted}`;
};


export async function getCachedQueryData({key, url, params = {}, ttl = 15 * 60_000}) {
    const cacheKey = makeCacheKey(key, params);
    const cached = await db.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < ttl) {
        console.log(`Cache hit for ${cacheKey}...`);
        return cached.data;
    }

    console.log(`Fetching fresh data for ${cacheKey}...`);
    try{
        const response = await axios.get(url, {params});
        const data = response.data;

        await db.cache.put({
            key: cacheKey,
            data,
            timestamp: Date.now(),
        });

        return data;
    } catch (error) {
        console.log(`Fetch failed for ${cacheKey}`, error);
        
        if(cached) {
            console.warn('Returning stale cache data')
            return cached.data;
        }

        throw error;
    };
};

export async function clearCacheByKey (keyPrefix) {
    const all = await db.cache.toArray();
    const matching = all.filter(item => item.key.startsWith(keyPrefix));
    for (const item of matching) await db.cache.delete(item.key);
};

export async function clearAllCache () {
    await db.cache.clear();
}