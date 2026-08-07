export function getAvatarUrl(
  metadata: Record<string, unknown> | null | undefined
): string | undefined {
  const m = metadata ?? {};
  const custom = m.custom_avatar_url;
  const avatar = m.avatar_url;
  const picture = m.picture;
  return (
    (typeof custom === "string" && custom) ||
    (typeof avatar === "string" && avatar) ||
    (typeof picture === "string" && picture) ||
    undefined
  );
}
