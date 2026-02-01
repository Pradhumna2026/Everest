export interface Milestone {
    id: number;
    name: string;
    elevation: number; // meters
    description: string;
    coordinates: { x: number; y: number }; // Percentage on the map path
}

export const MILESTONES: Milestone[] = [
    { id: 1, name: "Lukla Airport", elevation: 2860, description: "The gateway to Everest.", coordinates: { x: 5, y: 90 } },
    { id: 2, name: "Phakding", elevation: 2610, description: "First stop on the trek.", coordinates: { x: 10, y: 85 } },
    { id: 3, name: "Namche Bazaar", elevation: 3440, description: "Sherpa capital.", coordinates: { x: 15, y: 80 } },
    { id: 4, name: "Everest View Hotel", elevation: 3880, description: "First glimpse of the peak.", coordinates: { x: 20, y: 75 } },
    { id: 5, name: "Tengboche Monastery", elevation: 3867, description: "Spiritual center.", coordinates: { x: 25, y: 70 } },
    { id: 6, name: "Deboche", elevation: 3820, description: "Rhododendron forests.", coordinates: { x: 30, y: 65 } },
    { id: 7, name: "Pangboche", elevation: 3930, description: "Oldest monastery in Khumbu.", coordinates: { x: 35, y: 60 } },
    { id: 8, name: "Dingboche", elevation: 4410, description: "Summer valley.", coordinates: { x: 40, y: 55 } },
    { id: 9, name: "Nangkartshang Peak", elevation: 5083, description: "Acclimatization hike.", coordinates: { x: 45, y: 50 } },
    { id: 10, name: "Lobuche", elevation: 4910, description: "The final approach.", coordinates: { x: 50, y: 45 } },
    { id: 11, name: "Gorakshep", elevation: 5164, description: "Frozen lakebed.", coordinates: { x: 55, y: 40 } },
    { id: 12, name: "Everest Base Camp", elevation: 5364, description: "The expedition begins.", coordinates: { x: 60, y: 35 } },
    { id: 13, name: "Khumbu Icefall", elevation: 5486, description: "Treacherous beauty.", coordinates: { x: 65, y: 30 } },
    { id: 14, name: "Camp 1", elevation: 6065, description: "Valley of Silence.", coordinates: { x: 70, y: 25 } },
    { id: 15, name: "Camp 2", elevation: 6400, description: "Advanced Base Camp.", coordinates: { x: 75, y: 20 } },
    { id: 16, name: "Lhotse Face", elevation: 7100, description: "Steep wall of ice.", coordinates: { x: 80, y: 15 } },
    { id: 17, name: "Camp 3", elevation: 7200, description: "Perched on the face.", coordinates: { x: 85, y: 12 } },
    { id: 18, name: "Yellow Band", elevation: 7500, description: "Sedimentary rock layer.", coordinates: { x: 88, y: 9 } },
    { id: 19, name: "Geneva Spur", elevation: 7900, description: "Route to South Col.", coordinates: { x: 91, y: 6 } },
    { id: 20, name: "South Col", elevation: 7906, description: "The Death Zone entry.", coordinates: { x: 94, y: 4 } },
    { id: 21, name: "Balcony", elevation: 8400, description: "Resting spot.", coordinates: { x: 96, y: 2 } },
    { id: 22, name: "Hillary Step", elevation: 8790, description: "The final obstacle.", coordinates: { x: 98, y: 1 } },
    { id: 23, name: "Summit", elevation: 8848, description: "Top of the world.", coordinates: { x: 100, y: 0 } },
];
