package net.chandol.toy.bikeseoul.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class BikeSeoulController {
    @Autowired RestTemplate restTemplate;

    @GetMapping("/status")
    public String getStatus(){
        String url = "https://www.bikeseoul.com/app/station/getStationRealtimeStatus.do";
        return restTemplate.getForObject(url, String.class);
    }
}
