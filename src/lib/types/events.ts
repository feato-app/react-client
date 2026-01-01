export interface FeatureFlagEvent {
  key: string;
  value: boolean | null;
  updatedAt: Date;
}
