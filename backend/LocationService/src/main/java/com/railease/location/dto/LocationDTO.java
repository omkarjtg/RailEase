package com.railease.location.dto;

import com.railease.location.entity.Location;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationDTO {
    private Long id;
    private String city;
    private String state;
    private Integer postalCode;
    private String stationCode;

    public LocationDTO(Location location) {
        this.id = location.getLocationId();
        this.city = location.getCity();
        this.state = location.getState();
        this.postalCode = location.getPostalCode();
        this.stationCode = location.getStationCode();
    }

    public Location toEntity() {
        Location loc = new Location();
        loc.setLocationId(this.id);
        loc.setCity(this.city);
        loc.setState(this.state);
        loc.setStationCode(this.stationCode);
        loc.setPostalCode(this.postalCode);
        return loc;
    }
}
