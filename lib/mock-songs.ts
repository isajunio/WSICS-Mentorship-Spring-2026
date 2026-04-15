export interface Song {
  id: string
  title: string
  artist: string
  album: string
  bpm: number
  duration: number
  genre: string
  spotifyUrl: string
}

export interface Mood {
  label: string
  description: string
}

// Get mood based on BPM
export function getMoodForBpm(bpm: number): Mood {
  if (bpm < 60) return { label: "Calm", description: "Deep relaxation" }
  if (bpm < 80) return { label: "Relaxed", description: "Calm & easy listening" }
  if (bpm < 100) return { label: "Chill", description: "Laid-back vibes" }
  if (bpm < 120) return { label: "Moderate", description: "Steady groove" }
  if (bpm < 140) return { label: "Upbeat", description: "Feel-good energy" }
  if (bpm < 160) return { label: "Energetic", description: "High intensity" }
  if (bpm < 180) return { label: "Workout", description: "Push your limits" }
  return { label: "Intense", description: "Maximum power" }
}

// Mock songs database
export const allSongs: Song[] = [
  // 60-80 BPM - Relaxed
  { id: "1", title: "Stay With Me", artist: "Sam Smith", album: "In the Lonely Hour", bpm: 72, duration: 172, genre: "Soul Pop", spotifyUrl: "#" },
  { id: "2", title: "Riptide", artist: "Vance Joy", album: "Dream Your Life Away", bpm: 73, duration: 204, genre: "Indie Folk", spotifyUrl: "#" },
  { id: "3", title: "Let It Be", artist: "The Beatles", album: "Let It Be", bpm: 75, duration: 243, genre: "Rock", spotifyUrl: "#" },
  { id: "4", title: "Say Something", artist: "A Great Big World", album: "Is There Anybody Out There?", bpm: 68, duration: 229, genre: "Pop Ballad", spotifyUrl: "#" },
  { id: "5", title: "Wonderwall", artist: "Oasis", album: "(What's the Story) Morning Glory?", bpm: 76, duration: 258, genre: "Britpop", spotifyUrl: "#" },
  { id: "6", title: "Someone Like You", artist: "Adele", album: "21", bpm: 67, duration: 285, genre: "Pop Soul", spotifyUrl: "#" },
  { id: "7", title: "The Scientist", artist: "Coldplay", album: "A Rush of Blood to the Head", bpm: 75, duration: 309, genre: "Alternative", spotifyUrl: "#" },
  { id: "8", title: "Hallelujah", artist: "Jeff Buckley", album: "Grace", bpm: 70, duration: 403, genre: "Folk Rock", spotifyUrl: "#" },
  { id: "9", title: "Mad World", artist: "Gary Jules", album: "Trading Snakeoil for Wolftickets", bpm: 66, duration: 188, genre: "Indie", spotifyUrl: "#" },
  { id: "10", title: "Fix You", artist: "Coldplay", album: "X&Y", bpm: 69, duration: 295, genre: "Alternative", spotifyUrl: "#" },
  
  // 80-100 BPM - Chill
  { id: "11", title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", bpm: 85, duration: 200, genre: "Synthpop", spotifyUrl: "#" },
  { id: "12", title: "Lovely", artist: "Billie Eilish", album: "13 Reasons Why", bpm: 92, duration: 200, genre: "Dark Pop", spotifyUrl: "#" },
  { id: "13", title: "Take On Me", artist: "a-ha", album: "Hunting High and Low", bpm: 85, duration: 225, genre: "Synth-pop", spotifyUrl: "#" },
  { id: "14", title: "Shape of You", artist: "Ed Sheeran", album: "Divide", bpm: 96, duration: 233, genre: "Pop", spotifyUrl: "#" },
  { id: "15", title: "Despacito", artist: "Luis Fonsi", album: "Vida", bpm: 89, duration: 228, genre: "Reggaeton", spotifyUrl: "#" },
  { id: "16", title: "Thinking Out Loud", artist: "Ed Sheeran", album: "X", bpm: 79, duration: 281, genre: "Pop", spotifyUrl: "#" },
  { id: "17", title: "All of Me", artist: "John Legend", album: "Love in the Future", bpm: 80, duration: 269, genre: "R&B", spotifyUrl: "#" },
  { id: "18", title: "Photograph", artist: "Ed Sheeran", album: "X", bpm: 84, duration: 258, genre: "Pop", spotifyUrl: "#" },
  
  // 100-120 BPM - Moderate
  { id: "19", title: "Happy", artist: "Pharrell Williams", album: "Despicable Me 2", bpm: 100, duration: 232, genre: "Funk Pop", spotifyUrl: "#" },
  { id: "20", title: "Uptown Funk", artist: "Bruno Mars", album: "Uptown Special", bpm: 115, duration: 269, genre: "Funk", spotifyUrl: "#" },
  { id: "21", title: "Shake It Off", artist: "Taylor Swift", album: "1989", bpm: 120, duration: 219, genre: "Pop", spotifyUrl: "#" },
  { id: "22", title: "Can't Stop the Feeling", artist: "Justin Timberlake", album: "Trolls", bpm: 113, duration: 236, genre: "Disco Pop", spotifyUrl: "#" },
  { id: "23", title: "Stronger", artist: "Kanye West", album: "Graduation", bpm: 104, duration: 311, genre: "Hip-Hop", spotifyUrl: "#" },
  { id: "24", title: "Eye of the Tiger", artist: "Survivor", album: "Rocky III", bpm: 109, duration: 245, genre: "Rock", spotifyUrl: "#" },
  { id: "25", title: "Bangarang", artist: "Skrillex", album: "Bangarang", bpm: 110, duration: 215, genre: "Dubstep", spotifyUrl: "#" },
  { id: "26", title: "Cheap Thrills", artist: "Sia", album: "This Is Acting", bpm: 104, duration: 211, genre: "Pop", spotifyUrl: "#" },
  
  // 120-140 BPM - Upbeat
  { id: "27", title: "Don't Start Now", artist: "Dua Lipa", album: "Future Nostalgia", bpm: 124, duration: 183, genre: "Nu-Disco", spotifyUrl: "#" },
  { id: "28", title: "Physical", artist: "Dua Lipa", album: "Future Nostalgia", bpm: 125, duration: 193, genre: "Synth-pop", spotifyUrl: "#" },
  { id: "29", title: "Pump It", artist: "Black Eyed Peas", album: "Monkey Business", bpm: 128, duration: 213, genre: "Hip-Hop", spotifyUrl: "#" },
  { id: "30", title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", bpm: 130, duration: 203, genre: "Disco Pop", spotifyUrl: "#" },
  { id: "31", title: "Bad Guy", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP", bpm: 135, duration: 194, genre: "Electropop", spotifyUrl: "#" },
  { id: "32", title: "Thunderstruck", artist: "AC/DC", album: "The Razors Edge", bpm: 133, duration: 292, genre: "Hard Rock", spotifyUrl: "#" },
  { id: "33", title: "Run The World", artist: "Beyonce", album: "4", bpm: 127, duration: 236, genre: "Pop", spotifyUrl: "#" },
  { id: "34", title: "Sorry", artist: "Justin Bieber", album: "Purpose", bpm: 130, duration: 200, genre: "Pop", spotifyUrl: "#" },
  
  // 140-160 BPM - Energetic
  { id: "35", title: "Can't Hold Us", artist: "Macklemore", album: "The Heist", bpm: 146, duration: 258, genre: "Hip-Hop", spotifyUrl: "#" },
  { id: "36", title: "Titanium", artist: "David Guetta", album: "Nothing but the Beat", bpm: 126, duration: 245, genre: "EDM", spotifyUrl: "#" },
  { id: "37", title: "Wake Me Up", artist: "Avicii", album: "True", bpm: 124, duration: 247, genre: "EDM", spotifyUrl: "#" },
  { id: "38", title: "Animals", artist: "Martin Garrix", album: "Gold Skies", bpm: 128, duration: 305, genre: "Big Room", spotifyUrl: "#" },
  { id: "39", title: "Lean On", artist: "Major Lazer", album: "Peace Is the Mission", bpm: 98, duration: 176, genre: "EDM", spotifyUrl: "#" },
  { id: "40", title: "Closer", artist: "The Chainsmokers", album: "Collage", bpm: 95, duration: 244, genre: "EDM Pop", spotifyUrl: "#" },
  
  // 160+ BPM - Intense
  { id: "41", title: "Till I Collapse", artist: "Eminem", album: "The Eminem Show", bpm: 171, duration: 297, genre: "Hip-Hop", spotifyUrl: "#" },
  { id: "42", title: "Lose Yourself", artist: "Eminem", album: "8 Mile", bpm: 171, duration: 326, genre: "Hip-Hop", spotifyUrl: "#" },
  { id: "43", title: "Through The Fire", artist: "DragonForce", album: "Inhuman Rampage", bpm: 200, duration: 447, genre: "Power Metal", spotifyUrl: "#" },
  { id: "44", title: "Master of Puppets", artist: "Metallica", album: "Master of Puppets", bpm: 212, duration: 515, genre: "Thrash Metal", spotifyUrl: "#" },
  { id: "45", title: "Sandstorm", artist: "Darude", album: "Before the Storm", bpm: 136, duration: 224, genre: "Trance", spotifyUrl: "#" },
  
  // Additional variety
  { id: "46", title: "Old Town Road", artist: "Lil Nas X", album: "7", bpm: 68, duration: 157, genre: "Country Rap", spotifyUrl: "#" },
  { id: "47", title: "God's Plan", artist: "Drake", album: "Scorpion", bpm: 77, duration: 198, genre: "Hip-Hop", spotifyUrl: "#" },
  { id: "48", title: "Sicko Mode", artist: "Travis Scott", album: "Astroworld", bpm: 155, duration: 312, genre: "Hip-Hop", spotifyUrl: "#" },
  { id: "49", title: "Sunflower", artist: "Post Malone", album: "Spider-Verse", bpm: 90, duration: 158, genre: "Pop Rap", spotifyUrl: "#" },
  { id: "50", title: "Believer", artist: "Imagine Dragons", album: "Evolve", bpm: 125, duration: 204, genre: "Pop Rock", spotifyUrl: "#" },
]

// Filter songs by BPM within a tolerance range
export function filterSongsByBpm(targetBpm: number, tolerance: number = 5): Song[] {
  return allSongs
    .filter(song => Math.abs(song.bpm - targetBpm) <= tolerance)
    .sort((a, b) => Math.abs(a.bpm - targetBpm) - Math.abs(b.bpm - targetBpm))
}

// Get songs for a specific BPM range category
export function getSongsByBpmRange(minBpm: number, maxBpm: number): Song[] {
  return allSongs.filter(song => song.bpm >= minBpm && song.bpm <= maxBpm)
}
