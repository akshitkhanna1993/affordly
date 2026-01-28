import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import ResultsDisplay from "@/components/ResultsDisplay.vue";
import { useProfileStore } from "@/stores/profile";
import { testProfile, scenarioCItem } from "../utils/test-data";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: { template: "<div>Home</div>" } },
    { path: "/results", component: ResultsDisplay },
    { path: "/evaluate", component: { template: "<div>Evaluate</div>" } },
    { path: "/profile", component: { template: "<div>Profile</div>" } },
  ],
});

describe("ResultsDisplay", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    sessionStorage.clear();
    localStorage.clear();
  });

  it("should show loading state initially", () => {
    const wrapper = mount(ResultsDisplay, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("Analyzing");
  });

  it("should redirect to evaluate if no item data", async () => {
    const pushSpy = vi.spyOn(router, "push");
    mount(ResultsDisplay, {
      global: {
        plugins: [router],
      },
    });

    // Wait for onMounted to execute
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(pushSpy).toHaveBeenCalledWith("/evaluate");
  });

  it("should redirect to profile if no profile exists", async () => {
    const pushSpy = vi.spyOn(router, "push");
    sessionStorage.setItem("affordly-item", JSON.stringify(scenarioCItem));

    mount(ResultsDisplay, {
      global: {
        plugins: [router],
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(pushSpy).toHaveBeenCalledWith("/profile");
  });

  it("should display results when data is available", async () => {
    const store = useProfileStore();
    store.saveProfile(testProfile);
    sessionStorage.setItem("affordly-item", JSON.stringify(scenarioCItem));

    const wrapper = mount(ResultsDisplay, {
      global: {
        plugins: [router],
      },
    });

    // Wait for calculations
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(wrapper.text()).toContain("Affordability Analysis");
    expect(wrapper.find(".text-2xl").exists()).toBe(true);
  });

  it("should display verdict correctly", async () => {
    const store = useProfileStore();
    store.saveProfile({ ...testProfile, savings: 15000 });
    sessionStorage.setItem("affordly-item", JSON.stringify(scenarioCItem));

    const wrapper = mount(ResultsDisplay, {
      global: {
        plugins: [router],
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    const verdict = wrapper.find("h3.text-2xl");
    expect(verdict.exists()).toBe(true);
  });

  it("should display financial breakdown", async () => {
    const store = useProfileStore();
    store.saveProfile({ ...testProfile, savings: 15000 });
    sessionStorage.setItem("affordly-item", JSON.stringify(scenarioCItem));

    const wrapper = mount(ResultsDisplay, {
      global: {
        plugins: [router],
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(wrapper.text()).toContain("Affordability Checks");
    expect(wrapper.text()).toContain("Value Analysis");
    expect(wrapper.text()).toContain("Free Cashflow");
    expect(wrapper.text()).toContain("Net Cost");
  });

  it("should display item summary", async () => {
    const store = useProfileStore();
    store.saveProfile({ ...testProfile, savings: 15000 });
    sessionStorage.setItem("affordly-item", JSON.stringify(scenarioCItem));

    const wrapper = mount(ResultsDisplay, {
      global: {
        plugins: [router],
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(wrapper.text()).toContain("Item Summary");
    expect(wrapper.text()).toContain("Price");
    expect(wrapper.text()).toContain("Lifespan");
  });
});
