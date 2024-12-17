<template>
  <div class="main-container">
     <div class="content">
       <div class="search-container">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search for an artist..."
          @input="onSearch"
          class="search-box"
        />
      </div>

       <div class="results-grid">
        <div
          v-for="album in albums"
          :key="album.collectionId"
          class="album-card"
        >
          <img :src="album.artworkUrl100" :alt="album.collectionName" />
          <p class="album-title">{{ album.collectionName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAlbumsByArtist } from "@/services/apiService";

export default {
  data() {
    return {
      searchTerm: "",
      albums: [],
    };
  },
  methods: {
    async onSearch() {
      if (this.searchTerm.length > 1) {
        try {
          this.albums = await fetchAlbumsByArtist(this.searchTerm);
        } catch (error) {
          console.error("Error fetching albums:", error);
          this.albums = [];
        }
      } else {
        this.albums = [];
      }
    },
  },
};
</script>
