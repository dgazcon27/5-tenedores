import React from "react";
import { Text, View } from "react-native";
import { Image } from "react-native-elements";
import Carousel from "react-native-snap-carousel";

export default function CarouselImage({ arrayImages, height, width }) {
  const renderImage = ({ item }) => {
    return <Image style={{ width, height }} source={{ uri: item }} />;
  };

  return (
    <Carousel
      layout={"tinder"}
      layoutCardOffset={9}
      data={arrayImages}
      sliderWidth={width}
      itemWidth={width}
      renderItem={renderImage}
    />
  );
}
