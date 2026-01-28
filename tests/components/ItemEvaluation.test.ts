import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import ItemEvaluation from "@/components/ItemEvaluation.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: { template: "<div>Home</div>" } },
    { path: "/evaluate", component: ItemEvaluation },
    { path: "/results", component: { template: "<div>Results</div>" } },
    { path: "/profile", component: { template: "<div>Profile</div>" } },
  ],
});

describe("ItemEvaluation", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("should render the form with all fields", () => {
    const wrapper = mount(ItemEvaluation, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find("h2").text()).toContain("Evaluate a Purchase");
    expect(wrapper.find("#price").exists()).toBe(true);
    expect(wrapper.find("#recurring").exists()).toBe(true);
    expect(wrapper.find("#lifespan").exists()).toBe(true);
    expect(wrapper.find("#uses_per_week").exists()).toBe(true);
    expect(wrapper.find("#hours_total").exists()).toBe(true);
  });

  it("should disable submit button when form is invalid", () => {
    const wrapper = mount(ItemEvaluation, {
      global: {
        plugins: [router],
      },
    });

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes("disabled")).toBeDefined();
  });

  it("should enable submit button when form is valid with uses_per_week", async () => {
    const wrapper = mount(ItemEvaluation, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.find("#price").setValue(1000);
    await wrapper.find("#lifespan").setValue(12);
    await wrapper.find("#uses_per_week").setValue(5);

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes("disabled")).toBeUndefined();
  });

  it("should enable submit button when form is valid with hours_total", async () => {
    const wrapper = mount(ItemEvaluation, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.find("#price").setValue(1000);
    await wrapper.find("#lifespan").setValue(12);
    await wrapper.find("#hours_total").setValue(200);

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes("disabled")).toBeUndefined();
  });

  it("should save item data and navigate on submit", async () => {
    const pushSpy = vi.spyOn(router, "push");
    const wrapper = mount(ItemEvaluation, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.find("#price").setValue(1000);
    await wrapper.find("#recurring").setValue(50);
    await wrapper.find("#lifespan").setValue(24);
    await wrapper.find("#uses_per_week").setValue(5);
    await wrapper.find("#resale").setValue(0.3);

    await wrapper.find("form").trigger("submit.prevent");

    const storedItem = JSON.parse(sessionStorage.getItem("affordly-item") || "{}");
    expect(storedItem.price).toBe(1000);
    expect(storedItem.recurring).toBe(50);
    expect(storedItem.lifespan_months).toBe(24);
    expect(storedItem.uses_per_week).toBe(5);
    expect(storedItem.resale_pct).toBe(0.3);
    expect(pushSpy).toHaveBeenCalledWith("/results");
  });

  it("should handle default values correctly", async () => {
    const wrapper = mount(ItemEvaluation, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.find("#price").setValue(1000);
    await wrapper.find("#lifespan").setValue(12);
    await wrapper.find("#uses_per_week").setValue(5);

    await wrapper.find("form").trigger("submit.prevent");

    const storedItem = JSON.parse(sessionStorage.getItem("affordly-item") || "{}");
    expect(storedItem.recurring).toBe(0);
    expect(storedItem.resale_pct).toBe(0);
  });
});
