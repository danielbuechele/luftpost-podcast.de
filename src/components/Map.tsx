import {Episode as EpisodeT, allEpisodes} from 'contentlayer/generated';

import {
  LngLatLike,
  Map as MapGL,
  MapRef,
  Marker,
  ViewStateChangeEvent,
} from 'react-map-gl';
import Image from 'next/image';
import marker from '@/../public/marker.png';
import Supercluster from 'supercluster';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from '@/styles/Map.module.css';
import {useRouter} from 'next/router';
import React from 'react';

type Props = {
  selectedEpisodeId?: string;
};

const clusterMaxZoom = 14;
const clusterRadius = 20;
const initialViewState = {
  longitude: 0,
  latitude: 25,
  zoom: 2,
};
const bbox: GeoJSON.BBox = [-180, -90, 180, 90];

function Map(props: Props) {
  const mapRef = useRef<MapRef>(null);
  const sc = useMemo(
    () =>
      new Supercluster<EpisodeT>({
        maxZoom: clusterMaxZoom,
        radius: clusterRadius,
      }).load(
        allEpisodes.map((e) => ({
          type: 'Feature' as const,
          id: e._id,
          properties: e,
          geometry: {
            coordinates: [e.longitude, e.latitude],
            type: 'Point' as const,
          },
        })),
      ),
    [],
  );

  const [points, setPoints] = useState<
    Array<
      | Supercluster.PointFeature<EpisodeT & {cluster?: false}>
      | Supercluster.ClusterFeature<{}>
    >
  >(sc.getClusters(bbox, initialViewState.zoom));

  const onZoom = useCallback(
    (e: ViewStateChangeEvent) =>
      setPoints(sc.getClusters(bbox, e.viewState.zoom)),
    [sc],
  );

  useEffect(() => {
    const episode = allEpisodes.find((e) => e._id === props.selectedEpisodeId);

    mapRef.current?.flyTo({
      center: episode
        ? [episode.longitude, episode.latitude]
        : [initialViewState.longitude, initialViewState.latitude],
      zoom:
        episode == null
          ? initialViewState.zoom
          : Math.max(mapRef.current?.getZoom(), initialViewState.zoom),
    });
  }, [props.selectedEpisodeId]);

  const {push} = useRouter();

  return (
    <MapGL
      ref={mapRef}
      mapboxAccessToken="pk.eyJ1IjoiZGFuaWVsYnVlY2hlbGUiLCJhIjoiY2xkMjZoMmZiMDVvcjN1bWxmNHNwYXgweSJ9.tLy3xz0r55-30Vtqg3V6NA"
      initialViewState={initialViewState}
      mapStyle="mapbox://styles/danielbuechele/cjqcdcl08ejiv2sn1y35nc9du"
      onZoom={onZoom}
      reuseMaps={true}
    >
      {points.map((p) =>
        p.properties.cluster ? (
          <Marker
            key={p.properties.cluster_id}
            latitude={p.geometry.coordinates[1]}
            longitude={p.geometry.coordinates[0]}
            anchor="center"
            onClick={(e) => {
              if (p.properties.cluster) {
                const zoom = sc.getClusterExpansionZoom(
                  p.properties.cluster_id,
                );
                mapRef.current?.flyTo({
                  center: p.geometry.coordinates as LngLatLike,
                  zoom,
                });
              }
            }}
          >
            <div className={styles.cluster}>
              <div className={styles.clusterInner}>
                {p.properties.point_count}
              </div>
            </div>
          </Marker>
        ) : (
          <Marker
            key={p.properties._id}
            latitude={p.geometry.coordinates[1]}
            longitude={p.geometry.coordinates[0]}
            anchor="bottom"
            onClick={(e) => {
              if (!p.properties.cluster) {
                push(p.properties.slug);
              }
            }}
          >
            <div
              className={`${styles.marker} ${
                p.properties._id === props.selectedEpisodeId && styles.active
              }`}
            >
              <div className={styles.dot} />
              <Image
                className={styles.pin}
                src={marker}
                alt={p.properties.title}
                width={27}
              />
              <div className={styles.flag}>{p.properties.title}</div>
            </div>
          </Marker>
        ),
      )}
    </MapGL>
  );
}

export default React.memo(Map);
