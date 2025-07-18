import { z } from 'zod';

export const FunnelStageSchema = z.union([
  z.literal('top'),
  z.literal('bottom'),
]);

export const FacebookTopEventTypeSchema = z.union([
  z.literal('ad.view'),
  z.literal('page.like'),
  z.literal('comment'),
  z.literal('video.view'),
]);
export const FacebookBottomEventTypeSchema = z.union([
  z.literal('ad.click'),
  z.literal('form.submission'),
  z.literal('checkout.complete'),
]);
export const FacebookEventTypeSchema = z.union([
  FacebookTopEventTypeSchema,
  FacebookBottomEventTypeSchema,
]);

export const FacebookUserLocationSchema = z.object({
  country: z.string(),
  city: z.string(),
});

export const FacebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.union([
    z.literal('male'),
    z.literal('female'),
    z.literal('non-binary'),
  ]),
  location: FacebookUserLocationSchema,
});

export const FacebookEngagementTopSchema = z.object({
  actionTime: z.string(),
  referrer: z.union([
    z.literal('newsfeed'),
    z.literal('marketplace'),
    z.literal('groups'),
  ]),
  videoId: z.string().nullable(),
});

export const FacebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: z.union([
    z.literal('top_left'),
    z.literal('bottom_right'),
    z.literal('center'),
  ]),
  device: z.union([z.literal('mobile'), z.literal('desktop')]),
  browser: z.union([
    z.literal('Chrome'),
    z.literal('Firefox'),
    z.literal('Safari'),
  ]),
  purchaseAmount: z.string().nullable(),
});

export const FacebookEngagementSchema = z.union([
  FacebookEngagementTopSchema,
  FacebookEngagementBottomSchema,
]);

export const FacebookEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal('facebook'),
  funnelStage: FunnelStageSchema,
  eventType: FacebookEventTypeSchema,
  data: z.object({
    user: FacebookUserSchema,
    engagement: FacebookEngagementSchema,
  }),
});

export const TiktokTopEventTypeSchema = z.union([
  z.literal('video.view'),
  z.literal('like'),
  z.literal('share'),
  z.literal('comment'),
]);
export const TiktokBottomEventTypeSchema = z.union([
  z.literal('profile.visit'),
  z.literal('purchase'),
  z.literal('follow'),
]);
export const TiktokEventTypeSchema = z.union([
  TiktokTopEventTypeSchema,
  TiktokBottomEventTypeSchema,
]);

export const TiktokUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  followers: z.number(),
});

export const TiktokEngagementTopSchema = z.object({
  watchTime: z.number(),
  percentageWatched: z.number(),
  device: z.union([
    z.literal('Android'),
    z.literal('iOS'),
    z.literal('Desktop'),
  ]),
  country: z.string(),
  videoId: z.string(),
});

export const TiktokEngagementBottomSchema = z.object({
  actionTime: z.string(),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable(),
});

export const TiktokEngagementSchema = z.union([
  TiktokEngagementTopSchema,
  TiktokEngagementBottomSchema,
]);

export const TiktokEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal('tiktok'),
  funnelStage: FunnelStageSchema,
  eventType: TiktokEventTypeSchema,
  data: z.object({
    user: TiktokUserSchema,
    engagement: TiktokEngagementSchema,
  }),
});

export const EventSchema = z.union([FacebookEventSchema, TiktokEventSchema]);
