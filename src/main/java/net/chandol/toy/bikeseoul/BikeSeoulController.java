package net.chandol.toy.bikeseoul;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class BikeSeoulController {

    @GetMapping("/status")
    public String getStatus(){
        RestTemplate restTemplate = new RestTemplate();

        String data = restTemplate.getForObject("https://www.bikeseoul.com/app/station/getStationRealtimeStatus.do", String.class);

        return data;
    }
}
