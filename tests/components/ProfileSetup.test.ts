import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import ProfileSetup from "@/components/ProfileSetup.vue";
import { useProfileStore } from "@/stores/profile";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: { template: "<div>Home</div>" } },
    { path: "/profile", component: ProfileSetup },
    { path: "/evaluate", component: { template: "<div>Evaluate</div>" } },
  ],
});

describe("ProfileSetup", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should render the form with all fields", () => {
    const wrapper = mount(ProfileSetup, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find("h2").text()).toContain("Set Up Your Financial Profile");
    expect(wrapper.find("#income").exists()).toBe(true);
    expect(wrapper.find("#essentials").exists()).toBe(true);
    expect(wrapper.find("#savings").exists()).toBe(true);
    expect(wrapper.find("#savings_rate").exists()).toBe(true);
  });

  it("should display financial summary when values are entered", async () => {
    const wrapper = mount(ProfileSetup, {
      global: {
        plugins: [router],
      },
    });

    const incomeInput = wrapper.find("#income");
    const essentialsInput = wrapper.find("#essentials");

    await incomeInput.setValue(5000);
    await essentialsInput.setValue(3000);

    expect(wrapper.text()).toContain("Disposable Income");
    expect(wrapper.text()).toContain("$2000.00");
  });

  it("should disable submit button when form is invalid", () => {
    const wrapper = mount(ProfileSetup, {
      global: {
        plugins: [router],
      },
    });

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes("disabled")).toBeDefined();
  });

  it("should enable submit button when form is valid", async () => {
    const wrapper = mount(ProfileSetup, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.find("#income").setValue(5000);
    await wrapper.find("#essentials").setValue(3000);
    await wrapper.find("#savings").setValue(10000);
    await wrapper.find("#savings_rate").setValue(0.2);

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes("disabled")).toBeUndefined();
  });

  it("should save profile and navigate on submit", async () => {
    const pushSpy = vi.spyOn(router, "push");
    const wrapper = mount(ProfileSetup, {
      global: {
        plugins: [router],
      },
    });

    const store = useProfileStore();

    await wrapper.find("#income").setValue(5000);
    await wrapper.find("#essentials").setValue(3000);
    await wrapper.find("#savings").setValue(10000);
    await wrapper.find("#savings_rate").setValue(0.2);

    await wrapper.find("form").trigger("submit.prevent");

    expect(store.hasProfile).toBe(true);
    expect(store.profile?.income_monthly).toBe(5000);
    expect(pushSpy).toHaveBeenCalledWith("/evaluate");
  });

  it("should calculate monthly savings target correctly", async () => {
    const wrapper = mount(ProfileSetup, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.find("#income").setValue(5000);
    await wrapper.find("#savings_rate").setValue(0.2);

    expect(wrapper.text()).toContain("Monthly Savings Target");
    expect(wrapper.text()).toContain("$1000.00");
  });
});
