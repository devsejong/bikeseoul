package net.chandol.toy.seoulbike.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@Slf4j
@RestController
public class SeoulBikeController {
    private static final String BIKE_STATUS = "BIKE_STATUS";

    @Autowired
    RestTemplate restTemplate;

    @GetMapping("/status")
    @Cacheable(value=BIKE_STATUS)
    public String getStatus(){
        String url = "https://www.bikeseoul.com/app/station/getStationRealtimeStatus.do";
        return restTemplate.getForObject(url, String.class);
    }

    @CacheEvict(value = BIKE_STATUS)
    @Scheduled(fixedDelay = 30 * 1000 ,  initialDelay = 500)
    public void reportCacheEvict() {
        log.debug("Cache Flushed " + System.currentTimeMillis());
    }
}
