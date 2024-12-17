import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import HomeView from "../../views/HomeView.vue";
import { fetchAlbumsByArtist } from "@/services/apiService";

 vi.mock("@/services/apiService", () => ({
  fetchAlbumsByArtist: vi.fn(),
}));

describe("HomeView.vue", () => {
  it("renders the search input", () => {
    const wrapper = mount(HomeView);
    const input = wrapper.find(".search-box");
    expect(input.exists()).toBe(true);
  });

  it("updates searchTerm on input", async () => {
    const wrapper = mount(HomeView);
    const input = wrapper.find(".search-box");

    await input.setValue("Adele");
    expect(wrapper.vm.searchTerm).toBe("Adele");
  });

  it("calls onSearch when input length > 1", async () => {
    fetchAlbumsByArtist.mockResolvedValue([
      { collectionId: 1, collectionName: "Album 1", artworkUrl100: "url1" },
    ]);

    const wrapper = mount(HomeView);
    const input = wrapper.find(".search-box");

    await input.setValue("Adele");
    await wrapper.vm.onSearch();

    expect(fetchAlbumsByArtist).toHaveBeenCalledWith("Adele");
    expect(wrapper.vm.albums).toEqual([
      { collectionId: 1, collectionName: "Album 1", artworkUrl100: "url1" },
    ]);
  });

  it("displays albums correctly", async () => {
    fetchAlbumsByArtist.mockResolvedValue([
      { collectionId: 1, collectionName: "Album 1", artworkUrl100: "url1" },
      { collectionId: 2, collectionName: "Album 2", artworkUrl100: "url2" },
    ]);

    const wrapper = mount(HomeView);
    await wrapper.vm.onSearch();
    await wrapper.setData({ albums: await fetchAlbumsByArtist() });

    const albumCards = wrapper.findAll(".album-card");
    expect(albumCards.length).toBe(2);
    expect(albumCards[0].text()).toContain("Album 1");
    expect(albumCards[1].text()).toContain("Album 2");
  });
});
