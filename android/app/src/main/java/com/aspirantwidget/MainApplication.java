package com.aspirantwidget;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    // Attempt to initialize Firebase only if the Firebase SDK is present
    // AND the google-services configuration resource exists. This prevents
    // calling initializeApp when `google-services.json` is missing which
    // would cause a runtime "Please set a valid API key" error.
    try {
      Class.forName("com.google.firebase.FirebaseApp");
      // Check if google_app_id resource is present (added by google-services plugin)
      int googleAppIdRes = getResources().getIdentifier("google_app_id", "string", getPackageName());
      if (googleAppIdRes != 0) {
        Class<?> firebaseAppClass = Class.forName("com.google.firebase.FirebaseApp");
        java.lang.reflect.Method getAppsMethod = firebaseAppClass.getMethod("getApps", android.content.Context.class);
        java.util.List<?> apps = (java.util.List<?>) getAppsMethod.invoke(null, this);
        if (apps == null || apps.isEmpty()) {
          java.lang.reflect.Method initializeAppMethod = firebaseAppClass.getMethod("initializeApp", android.content.Context.class);
          initializeAppMethod.invoke(null, this);
        }
      } else {
        // No google-app-id configured; skip Firebase initialization.
      }
    } catch (ClassNotFoundException cnfe) {
      // Firebase SDK not present — nothing to initialize.
    } catch (Exception ex) {
      ex.printStackTrace();
    }

    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}
