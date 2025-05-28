// src/pages/AdminHome.jsx
import { Card, CardContent, Typography, Grid, CardActionArea } from "@mui/material";
import { IoMdRestaurant, IoIosAddCircle, IoIosList, IoIosPeople } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import styles from "./page.module.css";

export default function AdminHome() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Gerenciar Cardápio",
      description: "Adicione, edite ou remova pratos do cardápio.",
      icon: <IoMdRestaurant className={styles.featureIcon} />,
      path: "/admin/pratos",
    },
    {
      title: "Adicionar Prato",
      description: "Cadastre novos pratos no sistema.",
      icon: <IoIosAddCircle className={styles.featureIcon} />,
      path: "/admin/pratos/add",
    },
    {
      title: "Ver Pedidos",
      description: "Visualize e gerencie pedidos recebidos.",
      icon: <IoIosList className={styles.featureIcon} />,
      path: "/admin/pedidos",
    },
    {
      title: "Gerenciar Usuários",
      description: "Veja e administre os usuários cadastrados.",
      icon: <IoIosPeople className={styles.featureIcon} />,
      path: "/admin/users",
    },
  ];

   return (
      <section className={styles.container}>
        <Typography
          variant="h4"
          component="h1"
          className={styles.title}
          aria-label="Bem-vindo ao Sistema de Cardápio Online"
        >
          Painel administrativo
        </Typography>
        <br />
        <Grid container spacing={3} className={styles.grid}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                className={styles.card}
                onClick={() => navigate(feature.path)}
                role="button"
                aria-label={`Navegar para ${feature.title}`}
              >
                <CardContent className={styles.cardContent}>
                  <div className={styles.iconWrapper}>{feature.icon}</div>
                  <Typography variant="h6" component="h2" className={styles.cardTitle}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" className={styles.cardDescription}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </section>
    );
}
