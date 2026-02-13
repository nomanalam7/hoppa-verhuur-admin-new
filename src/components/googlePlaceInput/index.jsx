import React, { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const GooglePlacesInput = ({
  name,
  value = "",
  onChange,
  placeholder = "Start typing your address...",
  country = null,
  disabled = false,
  onPlaceSelected,
  fullWidth = true,
  inputBgColor = "#EFEFEF",
  style = {},
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAZgyAHxugn3hINdg4b9vJUHJtUHpJYw2U",
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["formatted_address", "geometry", "name"],
        componentRestrictions: country ? { country } : undefined,
      }
    );
    autocompleteRef.current = autocomplete;
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const address = place.formatted_address || place.name || "";

      onChange?.({ target: { name, value: address } });

      onPlaceSelected?.({
        address,
        latitude: place.geometry?.location?.lat?.(),
        longitude: place.geometry?.location?.lng?.(),
        place,
      });
    });

    // REAL FIX → Stop blur blocking selection
    const fixDropdownClick = () => {
      const items = document.querySelectorAll(".pac-item");
      items.forEach((item) => {
        item.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
        });
      });
    };

    const observer = new MutationObserver(fixDropdownClick);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isLoaded, country, name, onChange, onPlaceSelected]);

  if (loadError) return <input disabled value="Error loading maps" />;
  if (!isLoaded) return <input disabled value="Loading..." />;

  return (
    <>
      <style>{`.pac-container { z-index: 99999 !important; }`}</style>

      <input
        ref={inputRef}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: fullWidth ? "100%" : "auto",
          padding: "12px 20px",
          color: "#000",
          fontSize: "14px",
          borderRadius: "14px",
          border: "none",
          backgroundColor: inputBgColor,
          outline: "none",
          ...style,
        }}
      />
    </>
  );
};

export default GooglePlacesInput;
