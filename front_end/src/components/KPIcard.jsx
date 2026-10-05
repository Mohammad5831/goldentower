import { Card, CardContent, Typography } from "@mui/material";

export default function KPIcard({ title, value, icon, color = "primary" }) {
  return (
    <Card elevation={1} sx={{ borderRadius: 2, maxWidth: 100 }}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Typography variant="caption" color="text.secondary">{title}</Typography>
          <Typography variant="h6" sx={{ mt: 0.5 }}>{value}</Typography>
        </div>
        <div style={{ color: `var(--mui-palette-${color}-main)` }}>{icon}</div>
      </CardContent>
    </Card>
  );
}
